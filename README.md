# Morello API

REST API for eCommerce clothing website.

## API Calls

Request can be made with either forms or JSON objects. All properties are required
unless otherwise specified. Responses come as JSON objects.

### Users

#### New user


##### Route
```
POST /user
```
##### Example

Request
```
{
  username: 'Jane',
  email:    'jane.doe@gmail.com',
  password: 'secret123'
}

```
Response
```

{
    success:  true,
    message:  'User created successfully!',
    user:     {
            email: "jane.doe@gmail.com",
            username: 'Jane',
            user_group: 'user'
          }
}
```

#### Update user
Any property sent alongside the requests will be updated

##### Route
```
PUT /user/:username
```
##### Example
Request
```

{
  email: 'jane96@new-mail.com',
  token: 'xxxxx.xxxxx.xxxxx'
}
```
Response
```
{
    success:  true,
    message:  'User updated successfully!',
    user:     {
            email: "jane96@new-mail.com",
            username: 'Jane',
            user_group: 'user'
          }
}
```

#### Get user

##### Route
```
GET /user/:username
```
##### Example

Response
```
{
    success:  true,
    message:  'User retrieved successfully!',
    user:     {
            _id: "xxxxxxxxx"
            email: "jane96@new-mail.com",
            username: 'Jane',
            user_group: 'user',
            created_at:  '2017-10-27T09:15:02.078Z',
            cart: []
          }
}
```

#### Authenticate user
Users can be authenticated width either their username or email

##### Route
```
POST /user/authenticate
```
##### Example
Request
```

{
  email:    'jane96@new-mail.com',
  password: 'secret123'
}
```
Response
```
{
  success: true,
  message: 'Authentication successfull!',
  token:   'xxxxxx.xxxxxx.xxxxxx'
}
```
### Items

#### Get items based on category
Returns an array with items that matches ALL the specified categories. Categories are sent via a query string.
##### Route
```
GET /items?categories=value1,value2,value3
```
##### Example
Request
```
/items?categories=man,jacket
```
Response
```
[
    {
        _id: 'xxxxxxxxxx',
        name: 'Jacky',
        price: 47,
        color: 'blue',
        categories: [
            'man',
            'jacket'
        ],
        material: 'Jean',
        origin: 'USA',
        description: 'Lorem Ipsum Description'
    },
    {
        _id: 'xxxxxxxxxx',
        name: 'Jackie',
        price: 29,
        color: 'orange',
        categories: [
            'man',
            'jacket'
        ],
        material: 'Cotton',
        origin: 'USA',
        description: 'Lorem Ipsum Description'
    },
]
```
#### Get specific item
##### Route
```
GET /items/:itemID
```
##### Example
Response
```
{
    _id: 'xxxxxxxxxx',
    name: 'Baggie Shaggie',
    price: 15,
    color: 'tomato',
    categories: [
        't-shirt',
        'unisex'
    ],
    material: 'Cotton',
    origin: 'USA',
    description: 'Lorem Ipsum Description'
}
```
#### Create item
##### Route
```
POST /items
```
##### Example
Request
```
{
  name:        'Fancy Mikael',
  price:        404,
  color:       'transparent',
  description: 'Very fancy pants',      //Optional: defaults to Lerom Ipsum text
  material:    'silk',                  //Optional: defaults to Cotton
  origin:      'USA'                    //Optional: defaults to USA
  categories:  ['man', 'pants'],
  token:       xxxxxx.xxxxxx.xxxxx
}
```
Response
```
{
  success: true,
  message: 'item created successfully',
  item: {item}
}
```
#### Update item
Any property sent alongside the requests will be updated
##### Route
```
PUT /items/:itemID
```
##### Example
Request
```
{
  price: 42,
  token: 'xxxxx.xxxxx.xxxxx'
}
```
Response
```
{
  success:    true,
  message:    'Item updated successfully!',
  item:       {item}
}
```
#### Delete item
##### Route
```
DELETE /items/:itemID
```
##### Example
Response
```
{
  success: true,
  message: 'Item removed'
}
```
### Store
#### Get all orders
##### Route
```
GET /store
```
##### Examples
Response
```
{
  success:  true,
  message:  'Orders retrieved successfully',
  orders:   [orders]
}
```
#### Get order made by specific user
##### Route
```
GET /store/:userID
```
##### Example
Response
```
{
  success:  true,
  message:  'Orders retrieved successfully',
  orders:   [orders]

}
```
#### New order
##### Route
```
POST /store/checkout
```
##### Example
Requests
```
{
  token: xxxxx.xxxxx.xxxxx,
  cart: [
  {
    item_id: 'aaaaa',
    quantity: 2
  },
  {
    item_id: 'bbbbb',
    quantity: 1
  }
  ]
}
```
Response
```
{
    success: true,
    message: 'Order recieved successfully',
    order: {
        made_by: 'Jane',
        _id:     'xxxxxx',
        date:    '2017-10-31T12:27:47.453Z',
        items:  [
              {
                item_id: 'aaaaa',
                quantity: 2
              },
              {
                item_id: 'bbbbb',
                quantity: 1
              }
          ]
    }
}
```
