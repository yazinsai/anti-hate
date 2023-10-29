'use client';
import {useState} from "react";
import PostModal from "@/app/components/PostModal";

export default function Post({ text, image, role, companyName, companyEmail }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={"cursor-pointer shadow-md rounded w-52 p-3 mt-2 flex-none"} onClick={() => setShowModal(true)}>
                <div className={"mt-3"}>
                    <div className="text-2xl h-3 leading-none text-left ml-1 -mb-4">“</div>
                    <p className={"font-medium text-md w-10/12 text-center overflow-hidden line-clamp-2 max-h-12"} style={{ margin: '0 auto' }}>{text}</p>
                    <div className="text-2xl h-3 leading-none text-right mr-1 -mt-4">”</div>
                </div>
                <div className={"flex mt-3 gap-2 items-center"}>
                    <img className={"rounded-full h-7 w-7 object-cover"} src={ image } />
                    <p className={"font-medium text-xs text-gray-500"}> {role} </p>
                </div>
            </div>
            { showModal ? (
                <PostModal setShowModal={setShowModal} name={"Yoav Shlomo"} text={text} role={role} image={image} shortCompanyName={"P&G"} companyName={companyName} companyEmail={companyEmail} />
            ): null}
        </>
    )
}