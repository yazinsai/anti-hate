'use client';

import mistral from "@/lib/mistral";
import Logo from "@/app/components/Logo";
import Stat from "@/app/components/Stat";
import Company from "@/app/components/Company";
import React from "react";
import EmailModal from "@/app/components/EmailModal";

type PostParams = {
  quote: string;
  text: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
}


export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<PostParams | null>(null);
  const [show, setShow] = React.useState(false);

  function Post({ name, company, role, quote, text, avatar }: PostParams) {
    return (
      <div className={"cursor-pointer shadow-md rounded w-52 p-3 my-2 flex-none"} onClick={() => {
        setIsModalOpen(true);
        setSelectedPost({ name, company, role, quote, text, avatar });
      }}>
        <div className="my-6 text-center">
          <q className={"font-medium text-md text-center max-h-12"} style={{ margin: '0 auto' }}>{quote}</q>
        </div>
        <div className={"flex mt-3 gap-2 items-center"}>
          <img className={"rounded-full h-7 w-7 object-cover"} src={avatar} />
          <p className={"font-medium text-xs text-gray-500"}> {role} </p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full overflow-clip">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={selectedPost} onNext={() => setShow(true)} />

      <div className="px-3 py-4 border-t-4 border-black">
        <Logo></Logo>
        <div className={"mt-5 grid grid-cols-2"}>
          <Stat number={1247} title={"hateful posts"}></Stat>
          <Stat number={93} title={"reports submitted"}></Stat>
        </div>

        <div className={"mt-12"}>
          <Company companyName={"Urban Infra"} haters={4} logo={"/urban-infra.jpeg"} />
          <div className={"flex gap-4 -mx-3 py-4 overflow-x-auto px-4"}>
            <Post name="Mike Lee" company={"Urban Infra"} role={"Director of Construction Operations"} quote={"Kill them all, 100% of Gaza..."} avatar={"/mike-lee.png"} text="Kill them all, 100% of Gaza. Kill everything and BURN ALL REMAINS. This is going to be Biblical" />
            <Post name="Amitai Gat" company={"Salesforce"} role={"Cloud systems analyst"} quote={"Make me sick. We will kill them..."} avatar={"/amitai-gat.jpeg"} text="" />
            <Post name="Leonardo Daniel" company={"Universitat Ramon Llull"} role={"MSc Student"} quote={"shut the f*%k up while we kill them all."} avatar={"/leonardo-daniel.jpeg"} text="" />
            <Post name="Howie Ginsberg" company={"I.E.C"} role={"Admin"} quote={"these low lives don't deserve to live"} avatar={"/howie-ginsberg.jpeg"} text="For all of my friends around the world...look listen and learn.
The Hamas is a brutal, animalistic murderous organization that doesn't care about innocent Palestinian bystanders, so what do they care about innocent Israeli elderly people...women, mothers, children and youngsters who were at a festival. W.t.f. does the world need? More proof that these low lives don't deserve to see the sun shine? I say kill them all, before they kill us all.
Israel today...who knows where tomorrow???? My heart is torn to pieces...May we know better days...Amen" />
          </div>
        </div>

        <div className={"mt-12"}>
          <Company companyName={"Proctor & Gamble"} haters={2} logo={"/png.png"} />
          <div className={"flex gap-4 -mx-3 py-4 overflow-x-auto px-4"}>
            <Post name="Mike Lee" company={"Urban Infra"} role={"Finance Manager"} quote={"They should be wiped off the map"} avatar={"/rand (2).png"} text="" />
            <Post name="Amitai Gat" company={"Salesforce"} role={"IT Security Analyst"} quote={"wipe out the entire Palestinian people"} avatar={`/rand (1).png`} text="" />
          </div>
        </div>
      </div>

      <EmailModal show={show} onClose={() => setShow(false)} />
    </main>
  )
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => any;
  post: PostParams | null;
};

function Modal({ isOpen, onClose, onNext, post }: ModalProps) {
  if (!isOpen || !post) {
    return null;
  }

  function next(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // event.stopPropagation();
    onNext();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="bg-white p-5 rounded shadow-lg w-[90%] max-w-lg mx-auto">
        <div className="text-center">
          <q className="leading-snug text-gray-600">{post.text}</q>
          <div className="mt-8 flex flex-col gap-y-2 w-2/3 mx-auto">
            <img src={post.avatar} alt={post.name} className="rounded-full h-7 w-7 object-cover mx-auto" />
            <div>
              <p className="font-bold text-sm text-gray-700">{post.name}</p>
              <p className="font-medium text-sm text-gray-500">{post.role}, {post.company}</p>
            </div>
          </div>
        </div>
        <div className="h-6"></div>
        <hr className="border border-gray-300 w-[calc(100%+2.5rem)] -mx-5 mb-6" />
        <div className="font-bold text-gray-700">Take action</div>
        <p className="text-gray-600 leading-snug mt-3">Stop hateful speech. Take action against {post.name} by reporting this post to the Legal & HR department at {post.company}.</p>
        <button className="bg-gray-900 text-white font-medium w-full py-2 rounded-md mt-5 mb-4" onClick={next}>Report post to {post.company} &rarr;</button>
      </div>
    </div>
  );
}