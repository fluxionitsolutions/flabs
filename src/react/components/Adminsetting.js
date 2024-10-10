import React from "react";
import { useState } from "react";
const Adminsetting = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [filter, setFilter] = useState('labdetails');
    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };
    return (
            <div className="flex h-screen bg-background">
                <div className="  p-4 flex-1    flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-5">
                        <div className="relative w-96">
                        </div>
                    </div>
                </div>
            </div>     
    )
}
export default Adminsetting