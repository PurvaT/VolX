"use client";

import React from "react";

interface ListItemProps {
    item: React.ReactNode;
    index: number;
}
const ListItem = (props: ListItemProps) => {
    const {item, index} = props;
    return  <div 
                key={index} 
                className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg m-2 text-white"
                //className="flex items-center p-2 m-2 rounded-md text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer w-full bg-gray-700"
            >
                {item}
            </div>        
}   
export default ListItem;