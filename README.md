# Morello API

Backend API for E-commerce clothing websites.
Built with RESTful practices in mind.
Has support for adding, updating and fetching clothing items as well as user creation and authentication.
This project was built solely for educational purposes so
I advise you not to use it in any commercial purpose since it hasn't undergone proper testing
and probably lacks security features that should be in place. But feel free to play around with it!

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Using the API](#using-the-api)
  - [Overview of available routes](#overview-of-available-routes)
  - [Example request using fetch()](#example-request-using-fetch())
  - [User authentication](#user-authentication)
  - [Image handling with Cloudinary](#image-handling-with-Cloudinary)
- [Example API calls](#example-api-calls)
  - [Users](#users)
  - [Items](#items)
  - [Orders](#orders)




## Installation

```
git clone https://github.com/oskarssylwan/morello-api.git

npm install

```

## Configuration

For the application to work the environment variables displayed below needs to be set.
The easiest way is to just copy the .env.example file (renaming it to .env) and populate it with your information.
See the config.js file for more environment variable options such as token secret and hash rounds.

```
MONGODB_URI=
CLOUDINARY_NAME=       //cloud name
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```
## Using the API

Requests needs to be sent as JSON objects and with the header "Content-Type: application/json".
All properties shown in the examples are required unless otherwise specified.
Responses come as JSON objects.
Protected routes needs user authentication.

### Overview of available routes
```
// Items

GET       /items            // Fetch multiple items
POST      /items            // Create items           protected
GET       /items/:itemID    // Fetch specific item    
PUT       /items/:itemID    // Update specific item   protected
DELETE    /items/:itemID    // Delete specific        protected
```

```
// Users

GET       /user/:username       // Fetch user
PUT       /user/:username       // Update user          protected
POST      /user                 // Create user          protected
POST      /user/authenticate    // Authenticate user    protected

```
```
// Orders

GET       /store            // Fetch all current orders       protected
GET       /store/:userID    // Fetch specific users orders    protected
POST      /store/checkout   // Create new order               protected

```

### Example request using fetch()
```
const headers = new Headers();
headers.append("Content-Type", "application/json");

fetch('api_location/route', {
  method: "POST",
  headers: headers,
  body: JSON.stringify({
    username: username,
    password: password
  })
})
  .then(response => response.json())
  .then(json => console.log(json)))
  .catch(error => handle(error))
```

### User authentication
The API uses token based authentication so when a user has logged in via the /user/authenticate route the API will send a token as a response.
This token can later be sent alongside another request to authenticate the user. It us up to the client to store the token so it can be reused.

### Image handling with Cloudinary
For better performance the API uses cloudinary as a CDN and sends back the image URL with each response.
The easiest way to send the image alongside the request is by converting it to a Data URI but for more options see the cloudinary
[documentation](https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_api).


## Example API calls
### Users

#### Create user
```
POST /user
```
```
// Request

{
  username: 'Jane',
  email:    'jane.doe@gmail.com',
  password: 'secret123'
}

```
```
// Response

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
```
PUT /user/:username
```
```
// Request

{
  email: 'jane96@new-mail.com',
  token: 'xxxxx.xxxxx.xxxxx'
}
```
```
// Response

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
```
GET /user/:username
```
```
// Response
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

```
POST /user/authenticate
```
```
// Request

{
  email:    'jane96@new-mail.com',
  password: 'secret123'
}
```
```
// Response

{
  success: true,
  message: 'Authentication successfull!',
  token:   'xxxxxx.xxxxxx.xxxxxx'
}
```
### Items

#### Get multiple items

Get items by either categories or item IDs as query strings. Returns an array with the matched items. If no query parameters are present all items in the database will be returned.

```
GET /items?categories=value1,value2,value3
GET /items?itemIDs=value1,value2,value3
```

```
// Request

/items?categories=man,jacket
```
```
// Response

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
        description: ['paragraph', 'paragraph'],
        image_url: 'image_url'
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
        description: ['paragraph', 'paragraph'],
        image_url: 'image_url'
    },
]
```

#### Get specific item
```
GET /items/:itemID
```
```
// Response

{
  success: true,
  message: 'Item retrieved successfully!',
  item: {
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
      description: ['paragraph', 'paragraph'],
      image_url: 'image_url'
  }
}

```
#### Create item
```
POST /items
```
```
// Request

{
  name:        'Fancy Mikael',
  price:        404,
  color:       'transparent',
  description: ['paragraph', 'paragraph']   //Optional: defaults to Lerom Ipsum text
  material:    'silk',                      //Optional: defaults to Cotton
  origin:      'USA'                        //Optional: defaults to USA
  categories:  ['man', 'pants'],
  image:       'data:image/png;base64,iVBORw0KGgo...',
  token:       xxxxxx.xxxxxx.xxxxx
}
```
```
// Response
{
  success: true,
  message: 'item created successfully',
  item: {item}
}
```
#### Update item
Any property sent alongside the requests will be updated
```
PUT /items/:itemID
```
```
// Request

{
  price: 42,
  token: 'xxxxx.xxxxx.xxxxx'
}
```
```
// Response
{
  success:    true,
  message:    'Item updated successfully!',
  item:       {item}
}
```
#### Delete item
```
DELETE /items/:itemID
```
```
// Request

{
  token: 'xxxxx.xxxxx.xxxxx'
}
```
```
// Response

{
  success: true,
  message: 'Item removed'
}
```

### Orders
#### Get all orders
```
GET /store
```
```
// Response

{
  success:  true,
  message:  'Orders retrieved successfully',
  orders:   [orders]
}
```
#### Get order made by specific user
```
GET /store/:userID
```
```
// Response

{
  success:  true,
  message:  'Orders retrieved successfully',
  orders:   [orders]

}
```

#### New order
```
POST /store/checkout
```
```
// Requests

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
```
// Response

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
