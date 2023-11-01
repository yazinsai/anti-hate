import {useState} from "react";

// @ts-ignore
export default function PostModal({setShowModal, text, image, name, role, companyName, shortCompanyName, companyEmail}) {
    const [showEmail, setShowEmail] = useState(false)

    const emailSubject = `Urgent: Request for Immediate Action Regarding Offensive LinkedIn Post by ${ shortCompanyName } Employee`
    const mailContent = `Dear P&G legal team,

I was incredibly distraught to see a member of your staff post the hateful message below on LinkedIn:

I have been following the news on Gaza, and I only have one thing to say to the Palestinians there: now you get what your deserve. This is the government you voted in. This is on every single one of you.

Sent from: 
${name}
${role}, ${shortCompanyName}

I’d like you to take immediate action to address this hateful rhetoric or I will be forced to report this matter to the authorities.

Thanks for your attention,

[Your Name]`

    return (
        <>
            <div onClick={() => setShowModal(false)} className="opacity-75 fixed inset-0 bg-black"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded w-11/12" onClick={(e) => e.stopPropagation()}>
                { showEmail ? (
                    <>
                        <div className={"py-6 px-5"}>
                            <p className={"font-bold"}>Preview draft</p>
                            <p className={"font-medium text-gray-500 text-sm mt-3"}>
                                Dear { shortCompanyName } legal team, <br/>
                                <br/>
                                I was incredibly distraught to see a member of your staff post the hateful message below on LinkedIn:
                            </p>
                            <p className={"font-medium text-sm mt-2"}>
                                { text }
                            </p>
                            <div className={"flex mt-4 gap-2 items-center justify-end mt-4"}>
                                <img className={"rounded-full h-7 w-7 object-cover"} src={image}/>
                                <div className={""}>
                                    <p className={"font-medium text-xs text-gray-500"}> {name} </p>
                                    <p className={"font-medium text-xs text-gray-500"}> {role}, {shortCompanyName} </p>
                                </div>
                            </div>

                            <p className={"font-medium text-gray-500 text-sm mt-4"}>
                                I’d like you to take immediate action to address this hateful rhetoric or I will be forced to report this matter to the authorities.
                                <br/><br/>
                                Thanks for your attention,
                                <br/><br/>
                                [Your Name]
                            </p>
                        </div>
                        <hr className={"w-full bg-gray-500 my-1"}></hr>
                        <div className={"pb-6 px-5"}>
                            <a href={`mailto:${companyEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(mailContent)}`}
                                    className={"text-center bg-black py-2 px-4 rounded text-white mt-5 w-full"}
                                    type="button">Send via Gmail -{">"}</a>
                        </div>
                    </>
                ): (
                    <>
                        <div className={"pt-6 px-5"}>
                            <p className={"font-medium leading-normal text-sm"}>{text}</p>
                            <div className={"flex mt-3 gap-2 items-center justify-end mt-2"}>
                                <img className={"rounded-full h-7 w-7 object-cover"} src={image}/>
                                <div className={""}>
                                    <p className={"font-medium text-xs text-gray-500"}> {name} </p>
                                    <p className={"font-medium text-xs text-gray-500"}> {role}, {shortCompanyName} </p>
                                </div>
                            </div>
                        </div>
                        <hr className={"w-full bg-gray-500 my-3"}></hr>
                        <div className={"pb-3 px-5"}>
                            <p className={"font-bold"}>Take action</p>
                            <p>Stop hateful speech. Take action against {name} by reporting this post to the Legal & HR
                                department at {companyName}.</p>
                            <button onClick={() => setShowEmail(true)}
                                    className={"text-center bg-black py-2 px-4 rounded text-white mt-5 w-full"}
                                    type="button">Report post to {companyName}</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}