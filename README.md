# Midterm Project

Topic: Food Pick-up App

Burgers&Friends Food Pickup App serves as a communication tool between customers and a restaurant, Burgers&Friends.  

Upon a customer choosing the type and the quantity for each food item, the information is stored in a cart. After the user's confirmation, he/she's order and personal(name and phone number) is sent to the restaurant via a text. The restaurant is then able to provide an estimation on the preparation time and send this information back to the client as a confirmation for his/her order.

## Getting Started

1. [Create](https://github.com/RyanJohnson1612/midterm) a new repository using this repository as a template.
2. Clone your repository onto your local device.
3. Install dependencies using the `npm install` command.
4. Run `npm run db:reset` to load database. The database name midterm is used for the project. 
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.

## Dependencies

- body-parser ^1.19.1
- bootstrap-scss ^4.6.1
- chalk ^2.4.2
- cookie-session ^2.0.0
- dotenv ^2.0.0
- ejs ^2.6.2
- express ^4.17.1
- morgan ^1.9.1
- pg ^8.5.0
- pg-native ^3.0.0
- sass ^1.35.1
- twilio ^3.73.0

## Screenshots
!["Screenshot of the index page"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/1.%20index.png)
!["Screenshot of menu (customer side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/2.%20menus-index.png)
!["Screenshot of detail information of a food item (customer side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/3.%20menus-detail.png)
!["Screenshot of detail information of another food item (customer side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/4.%20menus-detail(2).png)
!["Screenshot of the cart with a summary of food item and quantity (customer side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/5.%20carts.png)
!["Screenshot of the table with all orders (restaurant side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/6.%20orders-index.png)
!["Screenshot of detail information of an individual order (restaurant side of view)"](https://github.com/RyanJohnson1612/midterm/blob/master/screen-shot-ducs/7.%20orders-detail.png)
