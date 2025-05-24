// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import Header from "./header";
// import Footer from "./footer";

// function MenuItemDetail() {
//   const { state } = useLocation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   if (!state?.item || !state?.allItems) {
//     return <p className="text-center mt-20 text-red-500">Item not found or data missing.</p>;
//   }

//   const item = state.item;
//   const allItems = state.allItems;

//   const relatedItems = allItems.filter(
//     (i) =>
//       i.itemName !== item.itemName &&
//       i.restaurantName === item.restaurantName
//   );

//   return (
//     <>
//       <Header />
//       <main className="p-6 md:p-12 bg-gray-100 min-h-screen">
//         {/* Item Details */}
//         <div className="bg-white p-6 rounded-xl shadow-lg mb-10 max-w-3xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-6">
//             <img
//               src={item.imageUrl}
//               alt={item.itemName}
//               className="w-64 h-64 object-cover rounded-xl"
//             />
//             <div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.itemName}</h2>
//               <p className="text-gray-600 text-sm mb-2">{item.description}</p>
//               <p className="text-yellow-500 font-medium mb-2">⭐ {item.rating}/5</p>
//               <p className="text-green-600 font-bold text-2xl mb-4">
//                 ₹{item.offerPrice ? item.offerPrice : item.price}
//               </p>
//               {item.offer && (
//                 <p className="text-red-500 font-medium mb-2">🎁 {item.offer}</p>
//               )}

//               <div className="flex gap-5">
//                 <button
//                   onClick={() => navigate("/payment", { state: { item } })}
//                   className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//                 >
//                   Order
//                 </button>

//                 <button
//                   onClick={() => navigate(-1)}
//                   className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//                 >
//                   ⬅ Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Items */}
//         {relatedItems.length > 0 && (
//           <div>
//             <h3 className="text-2xl font-semibold mb-4 text-gray-800">Related Items</h3>
//             <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
//               {relatedItems.map((related, index) => (
//                 <div
//                   key={index}
//                   onClick={() =>
//                     navigate(`/item/${related.id}`, {
//                       state: { item: related, allItems },
//                     })
//                   }
//                   className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition p-3"
//                 >
//                   <img
//                     src={related.imageUrl}
//                     alt={related.itemName}
//                     className="w-full h-44 object-contain rounded"
//                   />
//                   <h4 className="mt-2 font-bold text-gray-800">
//                     {related.itemName}
//                   </h4>
//                   <p className="text-gray-500 text-sm">{related.description}</p>
//                   <p className="text-yellow-600 text-sm">⭐ {related.rating}/5</p>
//                   <p className="font-bold text-green-600 text-sm">
//                     ₹{related.offerPrice ? related.offerPrice : related.price}
//                   </p>
//                   {related.offer && (
//                     <p className="text-sm text-red-600 font-medium">🎁 {related.offer}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default MenuItemDetail;




import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

function MenuItemDetail() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  if (!state?.item || !state?.allItems) {
    return <p className="text-center mt-20 text-red-500">Item not found or data missing.</p>;
  }

  const item = state.item;
  const allItems = state.allItems;

  const relatedItems = allItems.filter(
    (i) =>
      i.itemName !== item.itemName &&
      i.restaurantName === item.restaurantName
  );

  return (
    <>
      <Header />
      <main className="p-6 md:p-12 bg-gray-100 min-h-screen">
        {/* Item Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={item.imageUrl || "/default-image.jpg"}
              alt={item.itemName}
              className="w-64 h-64 object-cover rounded-xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.itemName}</h2>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="text-yellow-500 font-medium mb-2">⭐ {item.rating}/5</p>
              <p className="text-green-600 font-bold text-2xl mb-4">
                ₹{item.offerPrice ? item.offerPrice : item.price}
              </p>
              {item.offer && (
                <p className="text-red-500 font-medium mb-2">🎁 {item.offer}</p>
              )}

              <div className="flex gap-5">
                <button
                  onClick={() => navigate("/payment", { state: { item } })}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Order
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  ⬅ Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Related Items</h3>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
              {relatedItems.map((related, index) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/item/${related.id}`, {
                      state: { item: related, allItems },
                    })
                  }
                  className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition p-3"
                >
                  <img
                    src={related.imageUrl || "/default-image.jpg"}
                    alt={related.itemName}
                    className="w-full h-44 object-contain rounded"
                  />
                  <h4 className="mt-2 font-bold text-gray-800">
                    {related.itemName}
                  </h4>
                  <p className="text-gray-500 text-sm">{related.description}</p>
                  <p className="text-yellow-600 text-sm">⭐ {related.rating}/5</p>
                  <p className="font-bold text-green-600 text-sm">
                    ₹{related.offerPrice ? related.offerPrice : related.price}
                  </p>
                  {related.offer && (
                    <p className="text-sm text-red-600 font-medium">🎁 {related.offer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default MenuItemDetail;
