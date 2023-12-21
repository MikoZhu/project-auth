import asyncHandler from "express-async-handler";
import { UserModel } from "../models/UserModel";
import { CartModel } from "../models/CartModel";

// @desc Post user's cart information (with confirm button on frontend)
// @route POST /cart/:user_id
// @access Private
export const addUserCartController = asyncHandler(async (req, res) => {
  try {
       
    //find the correct user and the user get the authorization
    const user = await UserModel.findById(req.params.user_id);
    console.log(user);
    if (!user) {
      res.status(400).json({
        success: false,
        error: "User not found",
      });
    } else {
      const newShoppingCart = new CartModel({
        user_id: req.user.id,
        // Filling in cart fields
        flower: req.body.flower,        
        options: req.body.options,
        price: req.body.price,
        deliveryCost: req.body.deliveryCost,
        sum: req.body.sum,
      });

      // Save the new cart to the database
      await newShoppingCart.save();

      res.status(201).json({ success: true, response: newShoppingCart });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// @desc Delete all user's shopping carts (note: no GUI for neither delete all nor specific cart in DB and not fit for user usage/access. Also, no method of data transfer from product page to cart page yet)
// @route DELETE /cart/:user_id
// @access Private
export const deleteUserCartController = asyncHandler(async (req, res) => {
  try {
       
    //find all matching shopping carts to the user
    const shoppingCarts = await CartModel.find({ user_id: req.params.user_id});
    console.log(shoppingCarts);
    // if (!shoppingCarts) not working giving 201 status with empty array
    if (shoppingCarts.length == 0) {
      res.status(404).json({
        success: false,
        error: "No previous shopping cart was registered in our system",
      });
    }else{
      // each shopping cart (element) will then be deleted
      for (const element of shoppingCarts){
        console.log(element._id);
        await CartModel.findByIdAndDelete(element._id);           
      };    
        res.status(201).json({ success: true, response: "Shopping cart deleted successfully" });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  };
});

// @desc Get user's cart information (Note: No GUI for this request neither)
// @route Get /cart/:user_id
// @access Private
export const getUserCartController = asyncHandler(async (req, res) => {
    //find the user's profile information
  
    try {
      console.log("shopping cart")
      console.log(req.params.user_id) // Comes from /cart/:user_id
      console.log(req.user.id) // comes from decoded token in authneticateUser.js
      const shoppingCart = await CartModel.find({ user_id: req.params.user_id });
      //console.log(shoppingCart);
//       if(!shoppingCart) ==> {
//     "success": true,
//     "response": []
// }
      if (shoppingCart.length == 0) {
        res.status(404).json({ success: false, response: "Shopping order not found" });
      }else{
        res.status(200).json({ success: true, response: shoppingCart });
      } 
      } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // @desc Update user's cart information (Note: Dead-end with findOneAndUpdate method that has no save() to work with save() hook for maths logic.  Also, updates only already made purchases- not fit for user usage/access)
// @route PUT (or PATCH?) /cart/:cart_id
// @access Private
export const updateUserCartController = asyncHandler(async (req, res) => {
  //to update flower and/or options

  try {
    console.log("updating cart values")
    // have the _id of the element the cart and the actuall element changed
    // for example you want to update the flower then the input json would look like :
    // {"_id": ####,
    // "flower": updated_value
    // }
    console.log(req.params.cart_id) // Comes from /cart/:user_id
    console.log(req.user.id) // comes from decoded token in authenticateUser.js
    const cart_id = req.params.cart_id ;
    if (!cart_id){
      return res.status(404).json({success:false, response: `Error occured: Your shopping cart no ${cart_id} was not found.`})
    }
    const updateFlower = req.body.flower;
    const updateOption = req.body.options;
    console.log(updateFlower);
    console.log(updateOption);
    let updatedCart ;
    if(updateFlower){
      console.log(updateFlower);
       updatedCart = await CartModel.findOneAndUpdate(
          {_id:cart_id} ,
        {flower: updateFlower},
        { new: true } // Return the updated document
      );
      
    }
    if(updateOption){
       updatedCart = await CartModel.findByIdAndUpdate(
         cart_id,
        {options: updateOption},
        { new: true } // Return the updated document
      );    
    }
    
    res.status(200).json({ success: true, response: updatedCart });
    } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});