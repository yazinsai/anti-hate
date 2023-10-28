'use server';

import mistral from "@/lib/mistral";

export default async function Home() {
  const post = `
  BREAKING: LIBYA OFFERS WEAPONS TO HAMAS IF THE BORDER IS OPENED\nUnited Nations European Commission United Nations Volunteers Change the World Model United Nations CWMUN International Council of Peace and Security (ICPS) Wall Street Journal European Youth Parliament (EYP)\nAmnesty International Parliament of Canada European Youth Parliament (EYP) Department of State Global News TRT Real TalkTV News UK International Center for Journalists (ICFJ) International Journalists'​ Network (IJNet) International Federation of Journalists BRITISH SKY BROADCASTING LIMITED CNN BBC News 24 starnews FoxNews24X7.com BBC Wales News Sky News Arabia Al Arabiya News Channel Al Jazeera Media Institute Euronews الجزيرة بودكاست WorldNews Sky News Australia The Washington Post The European Times® NEWS Chinanews updates Netflix Thomson Reuters Fox Corporation United Nations International Court of Justice (ICJ). United States Senate\n#PalestineGenocide #IsraelGazaWar #IsraelTerorrist #غزة_تحت_الركام #Iran #مجزرة_مستشفى_المعمداني #GazaHospital #Hamas #CeasefireNOW #WeStandWithPalestine #StopWar #SafeGaza #StopTheGenocide #JusticeforGaza #Islam #Peacefulreligion #Muhammad #humanity #Peace #Justice #respect #religious #Palestine\n#PalestineGenocide #IsraelGazaWar #IsraelTerorrist #غزة_تحت_الركام\n#religion #islamophobia #CombatIslamophobia #humanrights #stopdiscrimination #respectforall #religiousfreedom #Islamicpost #Islamicquotes #Islamicquote #Islamicvalues #Islamicteachings #Islamiceducation #humanityfirst #humanitymatters #business #trading #education #job #work #translation #media #saudiarabia #religious #religiousstudies #religions #Palestine #Israel #Gaza #PalestineGenocide #GazaHospital
  `
  const postWithoutHashtags = removeHashtags(post)
  const isFlagged = await checkPost(postWithoutHashtags)

  return (
    <main>
      <h1>Test post</h1>
      <h2>Post</h2>
      <div>{post}</div>
      <hr />
      <h2>Result</h2>
      <div>{isFlagged ? 'Flagged' : 'Not flagged'}</div>
    </main>
  )
}

async function checkPost(post: string) {
  return await mistral.isFlagged(post)
}

function removeHashtags(post: string) {
  return post.replace(/#\w+/g, '')
}