export default function PostModal({setShowModal, text, image, name, role, companyName, shortCompanyName}) {

    return (
        <>
            <div onClick={() => setShowModal(false)} className="opacity-75 fixed inset-0 bg-black"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded w-11/12" onClick={(e) => e.stopPropagation()}>
                <div className={"pt-6 px-5"}>
                    <p className={"font-medium leading-normal text-sm"}>{ text }</p>
                    <div className={"flex mt-3 gap-2 items-center justify-end mt-2"}>
                        <img className={"rounded-full h-7 w-7 object-cover"} src={ image } />
                        <div className={""}>
                            <p className={"font-medium text-xs text-gray-500"}> {name} </p>
                            <p className={"font-medium text-xs text-gray-500"}> {role}, {shortCompanyName} </p>
                        </div>
                    </div>
                </div>
                <hr className={"w-full bg-gray-500 my-3"}></hr>
                <div className={"pb-3 px-5"}>
                    <p className={"font-bold"}>Take action</p>
                    <p>Stop hateful speech. Take action against { name } by reporting this post to the Legal & HR department at { companyName }.</p>
                    <button className={"text-center bg-gray-800 py-2 px-4 rounded text-white mt-5 w-full"} type="button">Report post to { companyName }</button>
                </div>
            </div>
        </>
    )
}