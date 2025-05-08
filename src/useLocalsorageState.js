
// import { useState, useEffect } from 'react';
// export function useLocalStorageState(key, initialState) {



//     const [value, setValue] = useState(function(){
//         const stordValue= localStorage.getItem(key);
//         return stordValue ? JSON.parse(stordValue) : initialState;
//       });
//       useEffect(function(){

//         localStorage.setItem(key, JSON.stringify(value));
//       },[key, value])
    
//     return [value, setValue];

// }

// the code above is the same but have problems with watched.map

import { useEffect, useState } from "react";
export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(() => {
      const storedValue = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(storedValue);
        // Make sure it's an array (or type you expect)
        return Array.isArray(parsed) ? parsed : initialState;
      } catch {
        return initialState;
      }
    });
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
  
    return [value, setValue];
  }
  