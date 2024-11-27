


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import './App.css';
// import 'tailwindcss/tailwind.css';

// function App() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [query, setQuery] = useState("restaurants near Mumbai");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [isPolling, setIsPolling] = useState(true);
//   const [showTable, setShowTable] = useState(false);
//   const [tableMessage, setTableMessage] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const fetchRestaurants = async () => {
//     if (!query) {
//       setError("Please enter a search query.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setRestaurants([]);
//     setTableMessage("Loading table...");
//     setShowTable(false);

//     setTimeout(() => {
//       setShowTable(true);
//       setTableMessage("Loading data, please wait...");
//     }, 5000);

//     try {
//       await axios.post('http://localhost:5000/api/extract-restaurants', { query });

//       const id = setInterval(async () => {
//         if (isPolling) {
//           await pollLiveData();
//         }
//       }, 8000);
//       setIntervalId(id);
//     } catch (err) {
//       setError("Error fetching restaurant data.");
//     }
//     // Removed setLoading(false); from here
//   };

//   const pollLiveData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/get-live-restaurants');
//       setRestaurants(response.data);

//       if (response.data.length > 0) {
//         setTableMessage("");
//       }
//     } catch (err) {
//       setError("Error polling live data.");
//       clearInterval(intervalId);
//     }
//   };

//   const stopScraping = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/stop-scraping');
//       setIsPolling(false);
//       setLoading(false); // This will hide the Stop button when scraping is stopped
//       clearInterval(intervalId);
//     } catch (err) {
//       setError("Error stopping scraping.");
//     }
//   };

//   const downloadCSV = () => {
//     const csvContent = [
//       ["Name", "Address", "Website", "Phone Number", "Rating", "Email", "Social Media Links"],
//       ...restaurants.map(restaurant => [
//         restaurant['Restaurant Name'],
//         restaurant['Address'],
//         restaurant['Website'],
//         restaurant['Phone Number'],
//         restaurant['Rating'],
//         restaurant['Email'],
//         restaurant['Social Media Links'].join(", ")
//       ])
//     ].map(e => e.join(",")).join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "restaurants.csv");
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(restaurants);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurants");
//     XLSX.writeFile(workbook, "restaurants.xlsx");
//   };

//   const downloadWord = () => {
//     const docContent = [
//       ["Name", "Address", "Website", "Phone Number", "Rating", "Email", "Social Media Links"],
//       ...restaurants.map(restaurant => [
//         restaurant['Restaurant Name'],
//         restaurant['Address'],
//         restaurant['Website'],
//         restaurant['Phone Number'],
//         restaurant['Rating'],
//         restaurant['Email'],
//         restaurant['Social Media Links'].join(", ")
//       ])
//     ].map(e => e.join("\t")).join("\n");

//     const blob = new Blob([docContent], { type: "application/msword;charset=utf-8;" });
//     saveAs(blob, "restaurants.doc");
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(prev => !prev);
//   };

//   useEffect(() => {
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [intervalId]);

//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-4">
//       <div className="text-center mb-6">
//         <h1 className="text-4xl font-bold mb-4">Data Extraction Results</h1>
//         <p className="text-lg">Search for data and download the results</p>
//       </div>

//       <div className="flex justify-center items-center mb-6">
//         <input
//           type="text"
//           className="p-3 border border-gray-600 rounded w-1/3 text-black placeholder-gray-400 hover:border-green-600 transition duration-300"
//           placeholder="Search for query..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           className={`ml-4 px-6 py-3 rounded ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-500'} text-white font-semibold transition duration-300`}
//           onClick={fetchRestaurants}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Fetch Data"}
//         </button>
//         {loading && (
//           <button
//             className="ml-4 px-6 py-3 rounded bg-red-500 text-black font-semibold"
//             onClick={stopScraping}
//           >
//             Stop
//           </button>
//         )}
//       </div>

//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       <p className="text-center text-yellow-300">{tableMessage}</p>

//       {showTable && (
//         <>
//           <p className="text-center text-green-400 mb-4">
//             {`Records extracted: ${restaurants.length}`}
//           </p>
//           <div className="overflow-auto max-h-96 border border-gray-600 rounded-lg mt-6">
//             <table className="min-w-full table-auto text-black">
//               <thead className="bg-gray-800 text-lg font-semibold">
//                 <tr>
//                   <th className="px-4 py-2 border">Name</th>
//                   <th className="px-4 py-2 border">Address</th>
//                   <th className="px-4 py-2 border">Website</th>
//                   <th className="px-4 py-2 border">Phone Number</th>
//                   <th className="px-4 py-2 border">Rating</th>
//                   <th className="px-4 py-2 border">Email</th>
//                   <th className="px-4 py-2 border">Social Media Links</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-gray-700">
//                 {restaurants.length > 0 ? (
//                   restaurants.map((restaurant, index) => (
//                     <tr key={index} className="hover:bg-gray-600 transition duration-300">
//                       <td className="border px-4 py-2">{restaurant['Restaurant Name']}</td>
//                       <td className="border px-4 py-2">{restaurant['Address']}</td>
//                       <td className="border px-4 py-2">{restaurant['Website']}</td>
//                       <td className="border px-4 py-2">{restaurant['Phone Number']}</td>
//                       <td className="border px-4 py-2">{restaurant['Rating']}</td>
//                       <td className="border px-4 py-2">{restaurant['Email']}</td>
//                       <td className="border px-4 py-2">{restaurant['Social Media Links'].join(", ")}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center text-gray-400 py-4">No data available</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex justify-end mt-4 mb-4">
//             <div className="relative w-28">
//               <button
//                 onClick={toggleDropdown}
//                 className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center w-full"
//               >
//                 Download
//                 <svg className="w-2 h-2 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
//                 </svg>
//               </button>
//               {showDropdown && (
//                 <div className="absolute left-0 top-full mt-3 w-full bg-white divide-y divide-gray-100 rounded-lg shadow z-10 dark:bg-gray-700">
//                   <ul className="py-1 text-xs text-gray-700 dark:text-gray-200">
//                     <li onClick={() => { downloadExcel(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                       Excel
//                     </li>
//                     <li onClick={() => { downloadCSV(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                       CSV
//                     </li>
//                     <li onClick={() => { downloadWord(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                       Word
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;
































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import './App.css'; // Custom styles
// import 'tailwindcss/tailwind.css'; // Tailwind CSS

// function App() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [query, setQuery] = useState("restaurants near Mumbai");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [intervalId, setIntervalId] = useState(null); // For polling
//   const [isPolling, setIsPolling] = useState(true); // To track polling state
//   const [showTable, setShowTable] = useState(false); // Track whether to show table

//   // Function to handle the query submission
//   const fetchRestaurants = async () => {
//     if (!query) {
//       setError("Please enter a search query.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setRestaurants([]); // Reset the list
//     setShowTable(false); // Hide table initially

//     try {
//       // Start scraping
//       await axios.post('http://localhost:5000/api/extract-restaurants', { query });

//       // Start polling every 2 seconds after initiating the extraction
//       const id = setInterval(async () => {
//         if (isPolling) {
//           await pollLiveData();
//         }
//       }, 6000);
//       setIntervalId(id); // Store interval ID so we can clear it later
//     } catch (err) {
//       setError("Error fetching restaurant data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to poll the live restaurant data
//   const pollLiveData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/get-live-restaurants');
//       setRestaurants(response.data); // Update the state with the live restaurant data
//       setShowTable(true); // Show table when data is available
//     } catch (err) {
//       setError("Error polling live data.");
//       clearInterval(intervalId); // Stop polling on error
//     }
//   };

//   // Function to stop the web scraping process
//   const stopScraping = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/stop-scraping'); // Stop the scraping process on the backend
//       setIsPolling(false); // Stop polling on frontend
//       setLoading(false); // Stop loading
//       clearInterval(intervalId); // Stop polling loop
//     } catch (err) {
//       setError("Error stopping scraping.");
//     }
//   };

//   // Stop polling when the component is unmounted
//   useEffect(() => {
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [intervalId]);

//   // Function to download restaurant data as CSV
//   const downloadCSV = () => {
//     const csvContent = [
//       ["Restaurant Name", "Address", "Website", "Phone Number", "Rating", "Email", "Social Media Links"].join(","),
//       ...restaurants.map(r =>
//         [
//           r['Restaurant Name'],
//           r['Address'],
//           r['Website'],
//           r['Phone Number'],
//           r['Rating'],
//           r['Email'],
//           r['Social Media Links'].join(" ")
//         ].join(",")
//       )
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'restaurants.csv');
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-6">
//       <div className="text-center mb-6">
//         <h1 className="text-4xl font-bold mb-4">Restaurant Extraction Results</h1>
//         <p className="text-lg">Search for restaurants and download the results</p>
//       </div>

//       <div className="flex justify-center items-center mb-6">
//         <input
//           type="text"
//           className="p-3 border border-gray-600 rounded w-1/3 text-black" // Adjusted width
//           placeholder="Enter query (e.g., restaurants near Mumbai)"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           className={`ml-4 px-4 py-2 rounded ${loading ? 'bg-gray-500' : 'bg-green-600'} text-white font-semibold`} // Adjusted button size
//           onClick={fetchRestaurants}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Fetch Restaurants"}
//         </button>
//         {loading && (
//           <button
//             className="ml-4 px-4 py-2 rounded bg-red-500 text-black font-semibold"
//             onClick={stopScraping}
//           >
//             Stop
//           </button>
//         )}
//       </div>

//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//       {loading && <p className="text-center text-yellow-300">Please wait, loading...</p>}

//       {showTable && (
//         <div className="flex justify-between items-center mb-4">
//           <p className="text-lg">{restaurants.length} Restaurants Extracted</p>
//           {restaurants.length > 0 && (
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded font-semibold"
//               onClick={downloadCSV}
//             >
//               Download CSV
//             </button>
//           )}
//         </div>
//       )}

//       {showTable && (
//         <div className="overflow-auto max-h-96 border border-gray-600 rounded-lg">
//           <table className="min-w-full table-auto text-black">
//             <thead className="bg-gray-800 text-lg font-semibold">
//               <tr>
//                 <th className="px-4 py-2 border">Restaurant Name</th>
//                 <th className="px-4 py-2 border">Address</th>
//                 <th className="px-4 py-2 border">Website</th>
//                 <th className="px-4 py-2 border">Phone Number</th>
//                 <th className="px-4 py-2 border">Rating</th>
//                 <th className="px-4 py-2 border">Email</th>
//                 <th className="px-4 py-2 border">Social Media Links</th>
//               </tr>
//             </thead>
//             <tbody className="bg-gray-700">
//               {restaurants.length > 0 ? (
//                 restaurants.map((restaurant, index) => (
//                   <tr key={index} className="hover:bg-gray-600">
//                     <td className="border px-4 py-2">{restaurant['Restaurant Name']}</td>
//                     <td className="border px-4 py-2">{restaurant['Address']}</td>
//                     <td className="border px-4 py-2">{restaurant['Website']}</td>
//                     <td className="border px-4 py-2">{restaurant['Phone Number']}</td>
//                     <td className="border px-4 py-2">{restaurant['Rating']}</td>
//                     <td className="border px-4 py-2">{restaurant['Email']}</td>
//                     <td className="border px-4 py-2">{restaurant['Social Media Links'].join(", ")}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center text-gray-400 py-4">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './App.css';
import 'tailwindcss/tailwind.css';

function App() {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("parks in Mumbai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [tableMessage, setTableMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchPlaces = async () => {
    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlaces([]);
    setTableMessage("Loading table...");
    setShowTable(false);

    setTimeout(() => {
      setShowTable(true);
      setTableMessage("Loading data, please wait...");
    }, 5000);

    try {
      await axios.post('http://localhost:5000/api/extract-places', { query });

      const id = setInterval(async () => {
        if (isPolling) {
          await pollLiveData();
        }
      }, 8000);
      setIntervalId(id);
    } catch (err) {
      setError("Error fetching place data.");
    }
  };

  const pollLiveData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-live-places');
      setPlaces(response.data);

      if (response.data.length > 0) {
        setTableMessage("");
      }
    } catch (err) {
      setError("Error polling live data.");
      clearInterval(intervalId);
    }
  };

  const stopScraping = async () => {
    try {
      await axios.post('http://localhost:5000/api/stop-scraping');
      setIsPolling(false);
      setLoading(false);
      clearInterval(intervalId);
    } catch (err) {
      setError("Error stopping scraping.");
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ["Name", "Address", "Website", "Phone Number", "Rating", "Additional Info"],
      ...places.map(place => [
        place['Name'],
        place['Address'],
        place['Website'],
        place['Phone Number'],
        place['Rating'],
        place['Additional Info']
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "places.csv");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(places);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Places");
    XLSX.writeFile(workbook, "places.xlsx");
  };

  const downloadWord = () => {
    const docContent = [
      ["Name", "Address", "Website", "Phone Number", "Rating", "Additional Info"],
      ...places.map(place => [
        place['Name'],
        place['Address'],
        place['Website'],
        place['Phone Number'],
        place['Rating'],
        place['Additional Info']
      ])
    ].map(e => e.join("\t")).join("\n");

    const blob = new Blob([docContent], { type: "application/msword;charset=utf-8;" });
    saveAs(blob, "places.doc");
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Place Data Extraction</h1>
        <p className="text-lg">Search for places and download the results</p>
      </div>

      <div className="flex justify-center items-center mb-6">
        <input
          type="text"
          className="p-3 border border-gray-600 rounded w-1/3 text-black placeholder-gray-400 hover:border-green-600 transition duration-300"
          placeholder="Search for places (e.g., parks in Mumbai)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={`ml-4 px-6 py-3 rounded ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-500'} text-white font-semibold transition duration-300`}
          onClick={fetchPlaces}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
        {loading && (
          <button
            className="ml-4 px-6 py-3 rounded bg-red-500 text-black font-semibold"
            onClick={stopScraping}
          >
            Stop
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <p className="text-center text-yellow-300">{tableMessage}</p>

      {showTable && (
        <>
          <p className="text-center text-green-400 mb-4">
            {`Records extracted: ${places.length}`}
          </p>
          <div className="overflow-auto max-h-96 border border-gray-600 rounded-lg mt-6">
            <table className="min-w-full table-auto text-black">
              <thead className="bg-gray-800 text-lg font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Website</th>
                  <th className="px-4 py-2 border">Phone Number</th>
                  <th className="px-4 py-2 border">Rating</th>
                  <th className="px-4 py-2 border">Additional Info</th>
                </tr>
              </thead>
              <tbody className="bg-gray-700">
                {places.length > 0 ? (
                  places.map((place, index) => (
                    <tr key={index} className="hover:bg-gray-600 transition duration-300">
                      <td className="border px-4 py-2">{place['Name']}</td>
                      <td className="border px-4 py-2">{place['Address']}</td>
                      <td className="border px-4 py-2">{place['Website']}</td>
                      <td className="border px-4 py-2">{place['Phone Number']}</td>
                      <td className="border px-4 py-2">{place['Rating']}</td>
                      <td className="border px-4 py-2">{place['Additional Info']}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4 mb-4">
            <div className="relative w-28">
              <button
                onClick={toggleDropdown}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center w-full"
              >
                Download
                <svg className="w-2 h-2 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute left-0 top-full mt-3 w-full bg-white divide-y divide-gray-100 rounded-lg shadow z-10 dark:bg-gray-700">
                  <ul className="py-1 text-xs text-gray-700 dark:text-gray-200">
                    <li onClick={() => { downloadExcel(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Excel
                    </li>
                    <li onClick={() => { downloadCSV(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      CSV
                    </li>
                    <li onClick={() => { downloadWord(); setShowDropdown(false); }} className="block px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Word
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;


























