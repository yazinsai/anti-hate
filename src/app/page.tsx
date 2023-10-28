'use server';
import mistral from "@/lib/mistral";
import Logo from "@/app/components/Logo";
import Stat from "@/app/components/Stat";
import Company from "@/app/components/Company";
import Post from "@/app/components/Post";
export default async function Home() {
  // const post = `BREAKING: LIBYA OFFERS WEAPONS TO HAMAS IF THE BORDER IS OPENED\nUnited Nations European Commission United Nations Volunteers Change the World Model United Nations CWMUN International Council of Peace and Security (ICPS) Wall Street Journal European Youth Parliament (EYP)\nAmnesty International Parliament of Canada European Youth Parliament (EYP) Department of State Global News TRT Real TalkTV News UK International Center for Journalists (ICFJ) International Journalists'​ Network (IJNet) International Federation of Journalists BRITISH SKY BROADCASTING LIMITED CNN BBC News 24 starnews FoxNews24X7.com BBC Wales News Sky News Arabia Al Arabiya News Channel Al Jazeera Media Institute Euronews الجزيرة بودكاست WorldNews Sky News Australia The Washington Post The European Times® NEWS Chinanews updates Netflix Thomson Reuters Fox Corporation United Nations International Court of Justice (ICJ). United States Senate\n#PalestineGenocide #IsraelGazaWar #IsraelTerorrist #غزة_تحت_الركام #Iran #مجزرة_مستشفى_المعمداني #GazaHospital #Hamas #CeasefireNOW #WeStandWithPalestine #StopWar #SafeGaza #StopTheGenocide #JusticeforGaza #Islam #Peacefulreligion #Muhammad #humanity #Peace #Justice #respect #religious #Palestine\n#PalestineGenocide #IsraelGazaWar #IsraelTerorrist #غزة_تحت_الركام\n#religion #islamophobia #CombatIslamophobia #humanrights #stopdiscrimination #respectforall #religiousfreedom #Islamicpost #Islamicquotes #Islamicquote #Islamicvalues #Islamicteachings #Islamiceducation #humanityfirst #humanitymatters #business #trading #education #job #work #translation #media #saudiarabia #religious #religiousstudies #religions #Palestine #Israel #Gaza #PalestineGenocide #GazaHospital`
  // const postWithoutHashtags = removeHashtags(post)
  // const isFlagged = await checkPost(postWithoutHashtags)
  return (
    <main>
      <div className={"bg-black w-full h-2"}> </div>
      <div className={"p-3"}>
        <Logo></Logo>
        <div className={"mt-5 flex justify-between"}>
          <Stat number={1154} title={"Hateful posts"}></Stat>
          <Stat number={154} title={"Emails sent"}></Stat>
        </div>

        <div className={"mt-12"}>
          <Company companyName={"Procter & Gamble"} haters={15} logo={"https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Procter_%26_Gamble_logo.svg/1280px-Procter_%26_Gamble_logo.svg.png"} />
          <div className={"flex gap-2 overflow-x-auto pb-4"}>
            <Post companyName={"Proctor & Gamble"} role={"Fulfilment Analyst"} text={"I have been following the news on Gaza, and I only have one thing to say to the Palestinians there: now you get what your deserve. This is the government you voted in. This is on every single one of you."} image={"https://www.choosingtherapy.com/wp-content/uploads/2021/11/Dr-Tanveer-Ahmed.jpg"} />
            <Post companyName={"Proctor & Gamble"} role={"Fulfilment Analyst"} text={"I have been following the news on Gaza, and I only have one thing to say to the Palestinians there: now you get what your deserve. This is the government you voted in. This is on every single one of you."} image={"https://www.choosingtherapy.com/wp-content/uploads/2021/11/Dr-Tanveer-Ahmed.jpg"} />
            <Post companyName={"Proctor & Gamble"} role={"Fulfilment Analyst"} text={"I have been following the news on Gaza, and I only have one thing to say to the Palestinians there: now you get what your deserve. This is the government you voted in. This is on every single one of you."} image={"https://www.choosingtherapy.com/wp-content/uploads/2021/11/Dr-Tanveer-Ahmed.jpg"} />
          </div>
        </div>
      </div>
    </main>
  )
}
