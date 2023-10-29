// @ts-ignore
export default function Stat({ number, title }) {
    return (
        <div className={"flex gap-2 items-center"}>
            <p className={"font-bold text-3xl"}>{ number.toLocaleString() }</p>
            <p className={"w-12 leading-none"}>{ title }</p>
        </div>
    )
}