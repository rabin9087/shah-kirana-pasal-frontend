// import { useState } from "react";
// import { AddressElement } from "@stripe/react-stripe-js";

// const ShippingAddressForm = ({ handelOnAddressChange } ) => {
//     const allowedSuburbs = ["Sydney", "Parramatta", "Chatswood", "Blacktown"];
//     const allowedCountries = [{ code: "AU", name: "Australia" }];

//     const [selectedSuburb, setSelectedSuburb] = useState(allowedSuburbs[0]);
//     const [selectedCountry, setSelectedCountry] = useState("AU");

//     return (
//         <div className="space-y-4">
//             {/* Country select (only Australia) */}
//             <label className="block font-medium">Country</label>
//             <select
//                 className="border rounded p-2 w-full"
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//             >
//                 {allowedCountries.map((c) => (
//                     <option key={c.code} value={c.code}>
//                         {c.name}
//                     </option>
//                 ))}
//             </select>

//             {/* Suburb select */}
//             <label className="block font-medium">Suburb</label>
//             <select
//                 className="border rounded p-2 w-full"
//                 value={selectedSuburb}
//                 onChange={(e) => setSelectedSuburb(e.target.value)}
//             >
//                 {allowedSuburbs.map((suburb) => (
//                     <option key={suburb} value={suburb}>
//                         {suburb}
//                     </option>
//                 ))}
//             </select>

//             {/* Stripe AddressElement for the rest of the address */}
//             <AddressElement
//                 className="p-2 border rounded"
//                 options={{
//                     mode: "shipping",
//                     allowedCountries: [selectedCountry],
//                     blockPoBox: false,
//                     fields: { phone: "always" },
//                     autocomplete: { mode: "automatic" },
//                 }}
//                 onChange={(event) => {
//                     const address = event.value?.address || {};
//                     handelOnAddressChange({
//                         ...event,
//                         value: {
//                             ...event.value,
//                             address: {
//                                 ...address,
//                                 city: selectedSuburb,
//                                 country: selectedCountry,
//                             },
//                         },
//                     });
//                 }}
//             />
//         </div>
//     );
// };

// export default ShippingAddressForm;
