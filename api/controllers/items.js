const Item = require('../../models/item');
const cloudinary = require('cloudinary');
const config = require('../../config');
const { response } = require('../../utility');

//Config
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_key,
  api_secret: config.cloudinary_secret
});

const methods = {

  // Param Id Methods
  findItem: async (req, res, next, id) => {
    try {
      req.item = await Item.findById(id);
      return next();
    } catch (error) {
      return next(new Error('Item could not be found'));
    }
  },

  // Route Methods
  getItemsByCategory: async (categories = []) => {
    try {
      const items = await Item.find({ categories: { $in: categories.split(',')}});
      if (items.length <= 0 ) throw new Error('No items found');
      return items;
    } catch (error) {
      throw error;
    }
  },

  getItemsByIds: async (ids) => {
    try {
      const items = await Item.find({ _id: { $in: ids.split(',')}});
      if (items.length <= 0 ) throw new Error('No items found');
      return items;
    } catch (error) {
      throw error;
    }
  },

  getItems: async (req, res, next) => {
    const { categories, itemIds } = req.query;
    let items;

    try {
      if(itemIds) {
        items = await methods.getItemsByIds(itemIds);
      } else if (categories) {
        items = await methods.getItemsByCategory(categories);
      } else {
        items = await Item.find({});
        if (items.length <= 0) throw new Error('No items found');
      }
      res.json(response('Item\'s retrieved successfully', { items }));

    } catch (error) {
      return next(error);
    }
  },

  // eslint-disable-next-line
  getItem: (req, res, next) =>
    res.json(response('Item retrieved successfully!', { item: req.item })),

  createItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {

      cloudinary.uploader.upload(req.body.image, result => {
        const item = new Item(req.body);
        item.image = result.url;
        item.save((error, itemEntry) => {
          if (error) next(error);
          res.json({
            success: true,
            message: 'Item created successfully!',
            item: item
          });
        })
      });
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  },

  updateItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      req.item.set(req.body);
      req.item.save((error, item) => {
        if (error) return next(error);

        res.json({
          success: true,
          message: 'Item updated successfully!',
          item: item
        });
      });
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  },

  deleteItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      req.item.remove(error => {
        if (error) return next(error);
        res.json({
          success: true,
          message: "Item removed"
        });
      })
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  }

};

module.exports = methods;
