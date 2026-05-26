const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status value");
      }

      // Suppose we have millions of request in our database thn this query will become very hard ---> when we query together in that case we need to index them both in that case use 'compund index'
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("Target user does not exist");
      }

      if (existingRequest) {
        return res
          .status(400)
          .send("Request already exists between these users");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run(
        "A new friend request from " + req.user.firstName,
        req.user.firstName + " is " + status + " in " + toUser.firstName,
      );
      console.log("Email sent response:", emailRes);
      res.json({
        message: `Request ${status}ed successfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("error sending request" + " " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status value");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      console.log("connectionRequest", connectionRequest);
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "No pending request found to review" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Request ${status}ed successfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("error reviewing request" + " " + err.message);
    }
  },
);

module.exports = requestRouter;

// You are given N strings.
// From each string, choose one character and combine them in order to form a new string.
// Print all possible strings that can be formed.
// Each resulting string must contain exactly N characters, where the i-th character comes from the i-th string.
// Example
// Input
// N = 3
// strings = ["ab", "cd", "ef"]

// Output
// ace
// acf
// ade
// adf
// bce
// bcf
// bde
// bdf

// N = 2
// strings = ["ab", "cd"]
// N = 3
// strings = ["a", "xyz", "pq"]
// N = 1
// strings = ["abc"]

// N = 3
// strings = ["ab", "", "cd"]

// const func = (arr) => {
//   let result = [];
//   function helper (index, current) {
//     if(index === arr.length){
//       result.push(current)
//       return;
//     }
//     for(let char of arr[index]){
//       helper(index+1, current + char)
//     }
//   }
//   helper(0, "");
//   return result
// }

// console.log("hello", func(["ab", "", "cd"]))

// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <title>Image Rotation 3x3</title>
//   <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
//   <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//   <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//   <style>
// body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
// .row { display: flex; justify-content: center; }
// .column img { display: block; max-width: 150px; }
// .inputTag { margin-bottom: 20px; }
//   </style>
// </head>
// <body>
//   <div id="app"></div>

//   <script type="text/babel">
//     const { useState } = React;

//     function App() {
//       const [angle, setAngle] = useState(0);

//       return (
//         <div>
//           <div className="inputTag">
//             Enter the angle:
//             <input
//               type="number"
//               value={angle}
//               onChange={(e) => setAngle(e.target.value)}
//             />
//           </div>

//           <div>
//             <div className="row">
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/crtmZTTr/image-part-001.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/CBKG24zM/image-part-002.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/nspY4xxD/image-part-003.jpg" />
//               </div>
//             </div>

//             <div className="row">
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/5YkBWFCB/image-part-004.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/v4dWyycN/image-part-005.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/YjhNf85b/image-part-006.jpg" />
//               </div>
//             </div>

//             <div className="row">
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/Mnb1KLBK/image-part-007.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/9r9Gs0F9/image-part-008.jpg" />
//               </div>
//               <div className="column" style={{transform: `rotate(${angle}deg)`}}>
//                 <img src="https://i.postimg.cc/jCmH8PKK/image-part-009.jpg" />
//               </div>
//             </div>

//           </div>
//         </div>
//       );
//     }

//     const root = ReactDOM.createRoot(document.getElementById('app'));
//     root.render(<App />);
//   </script>
// </body>
// </html>
