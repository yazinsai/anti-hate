// @ts-ignore
export default function Company({ logo, name, haters }) {

    return (
        <div className={"flex items-center gap-3"}>
            <img className={"rounded-full h-9 w-9 object-cover"} src={ logo } alt={ `${name} logo` } />
            <div>
                <p className={"font-bold text-xl leading-none"}>{ name }</p>
                <p className={"leading-none"}>{haters} haters</p>
            </div>
        </div>
    )
}
