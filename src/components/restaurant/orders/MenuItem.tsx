import React from 'react'

interface menu_item_props {
    idx: number,
    item_name: string,
    item_price: string | number,
    image: string,
    isSelected: boolean // Add the new isSelected prop
}

function MenuItem({ idx, item_name, item_price, image, isSelected }: menu_item_props) {

    return (
        <div
            className={`
                h-28 aspect-square flex flex-col items-center justify-center 
                rounded-lg cursor-pointer
                 ease-in-out transition-transform duration-300 transform
                ${isSelected ? "bg-blue-300 text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}
            `}
        >
            <img src={image} className='h-15 w-full transform transition-transform duration-300 rounded-lg' alt={item_name} />
            <p className="text-xs  text-center h-13">{item_name}</p>
            <p className="text-xs text-center mt-1">{item_price}</p>
        </div>
    )
}

export default MenuItem
