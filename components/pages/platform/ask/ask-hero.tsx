"use client";
// Ask hero: the signal-line field plus the looping ask demo (type a query, think, answer, repeat).
import { useCallback, useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/hero/cn";
import { AskVisualizer, THINKING_STATE_DURATION_MS, type VisualizerState } from "./ask-visualizer";

const avatarA = "/img/img-954f3dc4d2.jpg",
  avatarB = "/img/img-3b7156e7ea.jpg",
  avatarC = "/img/img-15114afa53.jpg";

const SHADOW = [
    "0px 0px 0px 1px rgba(28,40,64,0.04)",
    "0px 9px 4px 0px rgba(127,135,144,0.01)",
    "0px 5px 3px 0px rgba(127,135,144,0.05)",
    "0px 2px 2px 0px rgba(127,135,144,0.09)",
    "0px 1px 1px 0px rgba(127,135,144,0.1)",
  ],
  SHADOW_GLOW = [...SHADOW, "0px 0px 24px 20px rgba(255,255,255,1)"],
  SHADOW_SUBMIT = ["0px 2px 4px -2px rgba(15,107,233,0.12)", "0px 3px 6px -2px rgba(15,107,233,0.08)"];

type Task = {
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  others: string;
  title: string;
  userAvatar: string;
};
type Response =
  | {
      type: "email";
      bottomLink: string;
      email: { avatars: string[]; extraCount: string; label: string; preview: string; subject: string };
      greeting: string;
      query: string;
    }
  | {
      type: "featureRequest";
      bottomLink: string;
      card: { headerLabel: string; snippets: { avatars: string[]; progress: number; title: string }[] };
      greeting: string;
      query: string;
    }
  | {
      type: "meeting";
      bottomLink: string;
      greeting: string;
      meeting: { avatars: string[]; duration: string; startsIn: string; time: string; title: string };
      meetingLabel: string;
      query: string;
      subtitle: string;
      taskLabel: string;
      tasks: Task[];
    };

const RESPONSES: Response[] = [
  {
    bottomLink: "Suggest follow-up tasks",
    email: {
      avatars: [avatarA, avatarB, avatarC],
      extraCount: "2",
      label: "Draft email",
      preview: "Hi everyone, thanks for the productive check-in...",
      subject: "RE: Follow-Up on Initial Discussion",
    },
    greeting: "Based on your latest call with Richard, I've summarized the main points and drafted a follow-up email:",
    query: "Draft a follow up email",
    type: "email",
  },
  {
    bottomLink: "Draft summary of feedback to share with product",
    card: {
      headerLabel: "Customer feedback",
      snippets: [
        { avatars: [avatarA, avatarB], progress: 25, title: "Agents" },
        { avatars: [avatarA, avatarB, avatarC], progress: 25, title: "Mobile app" },
        { avatars: [avatarC], progress: 30, title: "Advanced reporting" },
      ],
    },
    greeting: "There were three feature requests mentioned in your latest customer feedback call with Greenleaf:",
    query: "Recap feature requests",
    type: "featureRequest",
  },
  {
    bottomLink: "Review past conversations with Greenleaf",
    greeting: "Good morning, Alex!",
    meeting: {
      avatars: [avatarA, avatarB],
      duration: "22 min",
      startsIn: "Starts in 6 mins",
      time: "Dec 12, 10:40 - 11:40 AM",
      title: "Greenleaf Onboarding",
    },
    meetingLabel: "Upcoming meetings:",
    query: "Prepare me for my day",
    subtitle: "Here's what you have for the rest of your day:",
    taskLabel: "Suggested follow-up tasks:",
    tasks: [
      {
        assignee: "Sarah Johnson",
        assigneeAvatar: avatarC,
        dueDate: "Today",
        others: "+3",
        title: "Proposal Review: Send proposal\nto Sarah Johnson",
        userAvatar: avatarA,
      },
      {
        assignee: "Sarah Johnson",
        assigneeAvatar: avatarC,
        dueDate: "Today",
        others: "+3",
        title: "Proposal Review: Send proposal\nto Sarah Johnson",
        userAvatar: avatarA,
      },
    ],
    type: "meeting",
  },
];
const QUERY_COUNT = RESPONSES.length;
const EASE_ENTER = [0.165, 0.84, 0.44, 1] as const;
const EASE_LIST = [0.25, 0.46, 0.45, 0.94] as const;

type Step = {
  backgroundState: VisualizerState;
  duration: number | "until-callback";
  foregroundState: VisualizerState;
  id: string;
};
const STEPS: Step[] = [
  { backgroundState: "b_placeholder", duration: 1e3, foregroundState: "b_placeholder", id: "idle" },
  { backgroundState: "c_typing", duration: "until-callback", foregroundState: "c_typing", id: "typing" },
  { backgroundState: "d_complete", duration: 600, foregroundState: "d_complete", id: "complete" },
  { backgroundState: "e_thinking", duration: THINKING_STATE_DURATION_MS, foregroundState: "e_thinking", id: "thinking" },
  { backgroundState: "f_responding", duration: "until-callback", foregroundState: "f_responding", id: "responding" },
  { backgroundState: "g_finished", duration: 2400, foregroundState: "g_finished", id: "finished" },
];

// Icons
function VideoCamera14(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M7 1.5C7.44539 1.5 7.72673 1.49862 7.96973 1.53711C9.25304 1.74056 10.2594 2.74697 10.4629 4.03027C10.4714 4.0841 10.4774 4.1403 10.4824 4.19922L11.1553 3.86328C11.4148 3.73349 11.6403 3.62024 11.8281 3.54688C12.0153 3.47378 12.2363 3.40997 12.4756 3.44531C12.8019 3.49357 13.094 3.67411 13.2832 3.94434C13.4218 4.14253 13.4641 4.36928 13.4824 4.56934C13.5008 4.77004 13.5 5.02245 13.5 5.3125V8.6875C13.5 8.9776 13.5008 9.22994 13.4824 9.43066C13.4641 9.63066 13.4217 9.85653 13.2832 10.0547C13.0941 10.3251 12.8021 10.5064 12.4756 10.5547C12.2363 10.59 12.0153 10.5262 11.8281 10.4531C11.6404 10.3798 11.4148 10.2665 11.1553 10.1367L10.4824 9.7998C10.4774 9.85908 10.4715 9.91561 10.4629 9.96973C10.2594 11.253 9.25305 12.2594 7.96973 12.4629C7.72673 12.5014 7.4454 12.5 7 12.5H5C4.30822 12.5 3.75934 12.5 3.31738 12.4639C2.86958 12.4273 2.48732 12.351 2.1377 12.1729C1.57348 11.8853 1.11472 11.4265 0.827148 10.8623C0.649016 10.5127 0.572719 10.1304 0.536133 9.68262C0.500031 9.24067 0.5 8.69177 0.5 8V6C0.5 5.30823 0.500028 4.75933 0.536133 4.31738C0.572721 3.8696 0.649011 3.48731 0.827148 3.1377C1.11472 2.57348 1.57348 2.11472 2.1377 1.82715C2.48732 1.64901 2.86959 1.57272 3.31738 1.53613C3.75934 1.50003 4.30822 1.5 5 1.5H7ZM5 2.5C4.29169 2.5 3.79023 2.50022 3.39844 2.53223C3.01265 2.56377 2.77691 2.62346 2.5918 2.71777C2.21555 2.9095 1.90951 3.21556 1.71777 3.5918C1.62346 3.7769 1.56377 4.01266 1.53223 4.39844C1.50022 4.79023 1.5 5.2917 1.5 6V8C1.5 8.7083 1.50022 9.20977 1.53223 9.60156C1.56376 9.98735 1.62346 10.2231 1.71777 10.4082C1.90951 10.7845 2.21555 11.0905 2.5918 11.2822C2.77691 11.3765 3.01264 11.4362 3.39844 11.4678C3.79023 11.4998 4.29168 11.5 5 11.5H7C7.48318 11.5 7.66689 11.4986 7.8125 11.4756C8.66828 11.34 9.34004 10.6683 9.47559 9.8125C9.49859 9.6669 9.5 9.48314 9.5 9V5C9.5 4.51685 9.4986 4.3331 9.47559 4.1875C9.34003 3.33173 8.66827 2.65996 7.8125 2.52441C7.66689 2.5014 7.48317 2.5 7 2.5H5ZM12.3291 4.43457C12.3502 4.43769 12.328 4.42556 12.1924 4.47852C12.0573 4.53128 11.8796 4.61926 11.6025 4.75781L10.5 5.30859V8.69043L11.6025 9.24219C11.8796 9.38071 12.0573 9.46873 12.1924 9.52148C12.3279 9.57441 12.3502 9.56231 12.3291 9.56543C12.3835 9.55739 12.4323 9.52652 12.4639 9.48145C12.4516 9.49895 12.473 9.48493 12.4863 9.33984C12.4995 9.19544 12.5 8.99725 12.5 8.6875V5.3125C12.5 5.00281 12.4995 4.80456 12.4863 4.66016C12.4731 4.51577 12.452 4.50047 12.4639 4.51758C12.4323 4.47264 12.3834 4.44259 12.3291 4.43457Z" fill="currentColor" />
    </svg>
  );
}
function Play12(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.15692 2.9802C3.86361 2.81399 3.5 3.02587 3.5 3.36301V8.63681C3.5 8.97395 3.86361 9.18584 4.15693 9.01962L8.81028 6.38272C9.10771 6.21418 9.10771 5.78565 8.81028 5.6171L4.15692 2.9802ZM2.5 3.36301C2.5 2.25964 3.68998 1.5662 4.64994 2.11018L9.30329 4.74708C10.2767 5.29868 10.2767 6.70114 9.30329 7.25274L4.64994 9.88964C3.68998 10.4336 2.5 9.74018 2.5 8.63681V3.36301Z" fill="currentColor" />
    </svg>
  );
}
function ArrowTurnDownRight14(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M2.5 2.5C2.22386 2.5 2 2.72386 2 3V6.5C2 7.88071 3.11929 9 4.5 9H9.29297L7.64648 10.6465L7.58203 10.7246C7.45387 10.9187 7.47562 11.1827 7.64648 11.3535C7.81735 11.5244 8.08131 11.5461 8.27539 11.418L8.35352 11.3535L10.8535 8.85352C10.9473 8.75975 11 8.63261 11 8.5C11 8.40056 10.9704 8.30419 10.916 8.22266L10.8535 8.14648L8.35352 5.64648C8.15825 5.45122 7.84175 5.45122 7.64648 5.64648C7.45122 5.84175 7.45122 6.15825 7.64648 6.35352L9.29297 8H4.5C3.67157 8 3 7.32843 3 6.5V3C3 2.72391 2.77607 2.50009 2.5 2.5Z" fill="currentColor" />
    </svg>
  );
}
function ArrowUp14(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M6.52029 1.35461C6.74186 1.09971 7.04291 1.12433 7.23807 1.31949L11.237 5.31852C11.4601 5.54159 11.4601 5.90305 11.237 6.12613C11.014 6.34918 10.6526 6.34918 10.4295 6.12613L7.40604 3.1027V12.007C7.40578 12.3222 7.15002 12.5782 6.83475 12.5783C6.5194 12.5783 6.26371 12.3223 6.26346 12.007V3.1027L3.24002 6.12613C3.01694 6.34918 2.65451 6.34918 2.43143 6.12613C2.20878 5.90304 2.20858 5.54148 2.43143 5.31852L6.43045 1.31949L6.52029 1.35461Z"
        fill="currentColor"
      />
    </svg>
  );
}
function RecordSearch14(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#ask-record-search-clip)">
        <path
          d="M10.3755 7.90283C11.7406 7.90306 12.8472 9.01028 12.8472 10.3755C12.8471 10.8607 12.7039 11.3111 12.4624 11.6929L13.6528 12.8843C13.8645 13.0966 13.8649 13.4407 13.6528 13.6528C13.4407 13.8649 13.0966 13.8645 12.8843 13.6528L11.6929 12.4624C11.3111 12.7039 10.8607 12.8471 10.3755 12.8472C9.01028 12.8472 7.90306 11.7406 7.90283 10.3755C7.90283 9.01014 9.01014 7.90283 10.3755 7.90283ZM9.89307 1.15283C11.5246 1.15298 12.8472 2.47638 12.8472 4.10791V6.51807C12.847 6.81798 12.6041 7.06171 12.3042 7.06201C12.0041 7.06201 11.7604 6.81817 11.7603 6.51807V4.10791C11.7603 3.07683 10.9241 2.24087 9.89307 2.24072H4.10791C3.07674 2.24072 2.24072 3.07674 2.24072 4.10791V9.89307C2.24087 10.9241 3.07683 11.7603 4.10791 11.7603H6.51807C6.81817 11.7604 7.06201 12.0041 7.06201 12.3042C7.06171 12.6041 6.81798 12.847 6.51807 12.8472H4.10791C2.47638 12.8472 1.15298 11.5246 1.15283 9.89307V4.10791C1.15283 2.47628 2.47628 1.15283 4.10791 1.15283H9.89307ZM10.3755 8.99072C9.6106 8.99072 8.99072 9.6106 8.99072 10.3755C8.99095 11.1402 9.61073 11.7603 10.3755 11.7603C11.14 11.76 11.76 11.14 11.7603 10.3755C11.7603 9.61073 11.1402 8.99095 10.3755 8.99072ZM6.51807 9.34912C6.8181 9.34935 7.06104 9.59298 7.06104 9.89307C7.06096 10.1931 6.81806 10.4368 6.51807 10.437H4.10693C3.80688 10.4369 3.56306 10.1931 3.56299 9.89307C3.56299 9.59293 3.80683 9.34927 4.10693 9.34912H6.51807ZM7.48193 7.42041C7.78216 7.42041 8.02588 7.66413 8.02588 7.96436C8.02588 8.26458 7.78216 8.5083 7.48193 8.5083H4.10693C3.80683 8.50815 3.56299 8.26449 3.56299 7.96436C3.56299 7.66422 3.80683 7.42056 4.10693 7.42041H7.48193ZM5.38232 3.56299C6.04283 3.56299 6.57922 4.09886 6.57959 4.75928V5.38232C6.57959 6.04305 6.04305 6.57959 5.38232 6.57959H4.75928C4.09886 6.57922 3.56299 6.04283 3.56299 5.38232V4.75928C3.56336 4.09909 4.09909 3.56336 4.75928 3.56299H5.38232ZM4.75928 4.65088C4.69955 4.65124 4.65124 4.69954 4.65088 4.75928V5.38232C4.65088 5.44237 4.69932 5.49133 4.75928 5.4917H5.38232C5.4426 5.4917 5.4917 5.4426 5.4917 5.38232V4.75928C5.49133 4.69932 5.44237 4.65088 5.38232 4.65088H4.75928Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="ask-record-search-clip">
          <rect width="13.5" height="13.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
function TaskCheck14(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M11.0005 8.50049C11.2764 8.50072 11.5005 8.72449 11.5005 9.00049V10.5005H13.0005C13.2764 10.5007 13.5005 10.7245 13.5005 11.0005C13.5005 11.2765 13.2764 11.5003 13.0005 11.5005H11.5005V13.0005C11.5005 13.2765 11.2764 13.5003 11.0005 13.5005C10.7243 13.5005 10.5005 13.2766 10.5005 13.0005V11.5005H9.00049C8.72435 11.5005 8.50049 11.2766 8.50049 11.0005C8.50049 10.7243 8.72435 10.5005 9.00049 10.5005H10.5005V9.00049C10.5005 8.72435 10.7243 8.50049 11.0005 8.50049ZM10.0005 1.00049C11.6571 1.00072 13.0005 2.34378 13.0005 4.00049V7.00049C13.0005 7.27649 12.7764 7.50026 12.5005 7.50049C12.2243 7.50049 12.0005 7.27663 12.0005 7.00049V4.00049C12.0005 2.89606 11.1049 2.00072 10.0005 2.00049H4.00049C2.89592 2.00049 2.00049 2.89592 2.00049 4.00049V10.0005C2.00049 11.1051 2.89592 12.0005 4.00049 12.0005H7.00049C7.27643 12.0007 7.50049 12.2245 7.50049 12.5005C7.50049 12.7765 7.27643 13.0003 7.00049 13.0005H4.00049C2.34363 13.0005 1.00049 11.6573 1.00049 10.0005V4.00049C1.00049 2.34363 2.34363 1.00049 4.00049 1.00049H10.0005ZM8.57568 5.23584C8.72198 5.00177 9.03003 4.93054 9.26416 5.07666C9.49827 5.22298 9.56955 5.53099 9.42334 5.76514L7.50342 8.83838C7.03782 9.58216 5.96953 9.62738 5.44287 8.92529L4.59912 7.80029C4.43384 7.57957 4.47935 7.26581 4.69971 7.1001C4.9206 6.93469 5.23429 6.97987 5.3999 7.20068L6.24365 8.32568C6.34893 8.46543 6.56153 8.45602 6.65479 8.30811L8.57568 5.23584Z"
        fill="currentColor"
      />
    </svg>
  );
}
function Clock12(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 8.20914 8.20914 10 6 10C3.79086 10 2 8.20914 2 6ZM6.5 3.5C6.5 3.22386 6.27614 3 6 3C5.72386 3 5.5 3.22386 5.5 3.5V6C5.5 6.27614 5.72386 6.5 6 6.5H8C8.27614 6.5 8.5 6.27614 8.5 6C8.5 5.72386 8.27614 5.5 8 5.5H6.5V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
function Camera12(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M6.5 1.5H4.5C3.11929 1.5 2 2.61929 2 4V8C2 9.38071 3.11929 10.5 4.5 10.5H6.5C7.88071 10.5 9 9.38071 9 8V4C9 2.61929 7.88071 1.5 6.5 1.5ZM8 4V8C8 8.82843 7.32843 9.5 6.5 9.5H4.5C3.67157 9.5 3 8.82843 3 8V4C3 3.17157 3.67157 2.5 4.5 2.5H6.5C7.32843 2.5 8 3.17157 8 4ZM9.5 4.30902L10.691 3.71353C10.8647 3.62667 11.0708 3.65033 11.2191 3.77399C11.3674 3.89765 11.4289 4.09661 11.3763 4.28284L11.3536 4.34549L11.5 8.5C11.5 8.77614 11.2761 9 11 9C10.7545 9 10.5504 8.82312 10.5081 8.58988L10.5 8.5L10.3536 4.34549L9.5 4.69098V7.30902L10.3536 7.65451L10.5 3.5C10.5 3.22386 10.7239 3 11 3C11.2455 3 11.4496 3.17688 11.4919 3.41012L11.5 3.5L11.3536 7.65451L11.3763 7.71716C11.4289 7.90339 11.3674 8.10235 11.2191 8.22601C11.0708 8.34967 10.8647 8.37333 10.691 8.28647L9.5 7.69098V4.30902Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** "..." that cycles 1 to 3 dots every 500ms. */
function Dots() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN((e) => (e % 3) + 1), 500);
    return () => clearInterval(id);
  }, []);
  return <span>{".".repeat(n)}</span>;
}

/** Types the query at 40ms per character with a blinking caret. */
function TypedQuery({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let t = 0;
    const id = setInterval(() => {
      if (t < text.length) {
        setShown(text.slice(0, t + 1));
        t++;
      } else {
        clearInterval(id);
        onComplete?.();
      }
    }, 40);
    return () => clearInterval(id);
  }, [text, onComplete]);
  return (
    <>
      {shown}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="ml-px inline-block h-[1em] w-[2px] bg-blue-500 align-middle"
      />
    </>
  );
}

/** Tool status pill with an optional sweeping shimmer. */
function ToolPill({ children, icon, shouldAnimate = true }: { children: ReactNode; icon?: ReactNode; shouldAnimate?: boolean }) {
  return (
    <span className="relative overflow-hidden rounded-md">
      {shouldAnimate && (
        <motion.span
          className="pointer-events-none absolute inset-0 z-10 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white-100/60 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity, repeatDelay: 0.8 }}
        />
      )}
      <span
        className={cn(
          "relative flex h-5 items-center justify-center gap-1.5 rounded-md border border-[#666666]/20 py-0.5 md:h-5.5",
          icon ? "px-1.5 md:px-2" : "px-1 md:px-1.5",
          "font-medium text-[#666666]/60 text-[11px] leading-[14px] md:text-[13px] md:leading-[18px]",
        )}
      >
        {icon}
        {children}
      </span>
    </span>
  );
}

/** Streams `text` after `delay` ms at `speed` ms per character. */
function StreamText({
  text,
  delay = 0,
  speed = 25,
  onComplete,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [shown, setShown] = useState(""),
    [started, setStarted] = useState(false),
    [done, setDone] = useState(false),
    cb = useRef(onComplete);
  useEffect(() => {
    cb.current = onComplete;
  });
  useEffect(() => {
    const id = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    let t = 0;
    const id = setInterval(() => {
      if (t < text.length) {
        setShown(text.slice(0, t + 1));
        t++;
      } else {
        clearInterval(id);
        setDone(true);
        cb.current?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [started, text, speed]);
  return started ? (
    <motion.p className={className}>
      {shown}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-px inline-block h-[0.9em] w-[2px] bg-blue-500 align-middle"
        />
      )}
    </motion.p>
  ) : null;
}

function MeetingCard({
  title,
  time,
  duration,
  startsIn,
  avatars,
  delay,
}: {
  title: string;
  time: string;
  duration: string;
  startsIn: string;
  avatars: string[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className={cn("flex max-w-80 flex-col overflow-hidden rounded-lg md:rounded-xl", "bg-white-100")}
      style={{ boxShadow: SHADOW.join(", ") }}
    >
      <div className="flex items-center">
        <div className="h-full w-[13px] overflow-hidden">
          <div className="mx-2.5 my-2.5 h-8 w-[3px] rounded-full bg-[#00d17e]" />
        </div>
        <div className="flex flex-1 flex-col py-2 pr-3 pl-2 md:py-2.5 md:pr-4 md:pl-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-[13px] text-primary-foreground leading-[18px] tracking-[-0.14px] md:text-[14px] md:leading-[20px]">
                {title}
              </span>
              <div className="flex items-center gap-0.5 text-[11px] leading-[14px] md:text-[12px] md:leading-[16px]">
                <span className="text-tertiary-foreground">{time}</span>
                <span className="text-quaternary-foreground">{"·"}</span>
                <div className="flex items-center gap-1">
                  <Camera12 className="size-3 text-tertiary-foreground" />
                  <span className="text-tertiary-foreground">{duration}</span>
                </div>
              </div>
            </div>
            <div className="flex -space-x-1 pt-0.5">
              {avatars.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.1 + 0.1 * i, duration: 0.25 }}
                  className="size-4 rounded-full border border-white-100 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-[rgba(0,0,0,0.05)]" />
      <div className="flex items-center justify-between px-3 py-2 md:py-2.5">
        <div className="flex items-center gap-1">
          <Clock12 className="size-3 text-tertiary-foreground" />
          <span className="font-medium text-[11px] text-tertiary-foreground leading-[14px] md:text-[12px] md:leading-[16px]">
            {startsIn}
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.25 }}
          className={cn(
            "flex h-5 items-center gap-[3px] rounded-md px-1 md:h-5.5 md:px-1.5",
            "bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)]",
          )}
        >
          <Camera12 className="size-3 text-primary-foreground" />
          <span className="px-px font-medium text-[11px] text-primary-foreground leading-[14px] md:text-[12px] md:leading-[16px]">
            {"Join meeting"}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function TaskCard({ title, userAvatar, others, assigneeAvatar, assignee, dueDate, delay }: Task & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className={cn("flex flex-col gap-3 rounded-lg py-2 pr-2 pl-2.5 md:rounded-xl md:py-2 md:pr-2 md:pl-2.5", "bg-white-100")}
      style={{ boxShadow: SHADOW.join(", ") }}
    >
      <div className="flex items-start gap-2">
        <div className="flex shrink-0 items-start py-0.5">
          <TaskCheck14 className="size-4 text-[#999999]" />
        </div>
        <p className="flex-1 whitespace-pre-wrap font-medium text-[13px] text-primary-foreground leading-[18px] tracking-[-0.28px] md:text-[14px] md:leading-[18px]">
          {title}
        </p>
      </div>
      <div className="flex items-center gap-1 pb-1 pl-[22px] text-[10px] leading-[14px] tracking-[-0.12px] md:text-[12px] md:leading-[16px]">
        <div className="flex items-center gap-1">
          <img src={userAvatar} alt="" className="size-3 rounded-full border border-[rgba(0,0,0,0.05)] object-cover" />
          <div className="flex items-center gap-0.5 font-medium">
            <span className="text-[#505155]">{"You"}</span>
            <span className="text-quaternary-foreground">{others}</span>
          </div>
        </div>
        <span className="font-medium text-quaternary-foreground">{"·"}</span>
        <div className="flex items-center gap-1">
          <img src={assigneeAvatar} alt="" className="size-3 rounded-full border border-[rgba(0,0,0,0.05)] object-cover" />
          <span className="font-medium text-[#505155]">{assignee}</span>
        </div>
        <span className="font-medium text-quaternary-foreground">{"·"}</span>
        <span className="font-medium text-[#cf8300]">{dueDate}</span>
      </div>
    </motion.div>
  );
}

function EmailCard({
  label,
  subject,
  preview,
  avatars,
  extraCount,
  delay,
}: {
  label: string;
  subject: string;
  preview: string;
  avatars: string[];
  extraCount: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className={cn(
        "mb-8 flex flex-col rounded-lg md:rounded-xl",
        "bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)]",
      )}
    >
      <div className="flex items-start px-3 py-2.5 md:px-3 md:py-2.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="font-medium text-[11px] text-quaternary-foreground leading-[14px] md:text-[12px] md:leading-[16px]">
            {label}
          </span>
          <span className="font-medium text-[13px] text-primary-foreground leading-[18px] tracking-[-0.14px] md:text-[14px] md:leading-[20px]">
            {subject}
          </span>
          <span className="truncate font-medium text-[11px] text-tertiary-foreground leading-[14px] md:text-[12px] md:leading-[16px]">
            {preview}
          </span>
        </div>
        <div className="flex items-start pt-0.5 pr-1">
          <div className="flex -space-x-1">
            {avatars.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt=""
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.1 + 0.08 * i, duration: 0.25 }}
                className="size-4 rounded-full border border-white-100 object-cover"
              />
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1 + 0.08 * avatars.length, duration: 0.25 }}
              className="flex size-4 items-center justify-center rounded-full border border-[#e6e7ea] bg-[#f8f9fa]"
            >
              <span className="font-medium text-[9px] text-tertiary-foreground leading-[12px] md:text-[10px] md:leading-[14px]">
                {extraCount}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Snippet({ title, avatars, progress, delay }: { title: string; avatars: string[]; progress: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex h-5 items-center justify-between">
        <span className="font-medium text-[11px] text-primary-foreground leading-[14px] tracking-[-0.12px] underline decoration-[rgba(0,0,0,0.1)] md:text-[12px] md:leading-[16px]">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5 pr-1.5">
            {avatars.map((src, i) => (
              <img key={src + i} src={src} alt="" className="size-4.5 rounded-full border border-white-100 object-cover" />
            ))}
          </div>
          <button
            type="button"
            className={cn(
              "flex size-5 items-center justify-center rounded-md",
              "bg-white-100 shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.07),0px_1px_2px_-1px_rgba(0,0,0,0.04)]",
            )}
          >
            <Play12 className="size-3 text-primary-foreground" />
          </button>
        </div>
      </div>
      <div className="px-px">
        <div className="h-1 w-full rounded-full bg-[#f8f9fa]">
          <div className="relative h-full rounded-full bg-black-100/25" style={{ left: 1e3 * delay - 160, width: `${progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

function FeedbackCard({
  headerLabel,
  snippets,
  delay,
}: {
  headerLabel: string;
  snippets: { avatars: string[]; progress: number; title: string }[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className={cn(
        "mb-8 flex w-full flex-col overflow-hidden rounded-lg md:rounded-xl",
        "bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)]",
      )}
    >
      <div className="flex items-center justify-between p-2 md:pr-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex size-5 items-center justify-center rounded-md border border-[#d6e5ff] bg-[#e5eeff]">
            <VideoCamera14 className="size-3.5 text-[#3b82f6]" />
          </div>
          <span className="font-medium text-[13px] text-primary-foreground leading-[18px] tracking-[-0.14px] underline decoration-[rgba(0,0,0,0.1)] md:text-[14px] md:leading-[20px]">
            {headerLabel}
          </span>
        </div>
        <button
          type="button"
          className={cn(
            "flex h-5 items-center gap-[3px] rounded-md px-1 md:h-5.5 md:px-1.5",
            "bg-white-100 shadow-[0px_0px_2px_0px_rgba(28,40,64,0.18),0px_1px_3px_0px_rgba(0,0,0,0.04)]",
          )}
        >
          <Play12 className="size-3 text-primary-foreground" />
          <span className="px-px font-medium text-[11px] text-primary-foreground leading-[14px] md:text-[12px] md:leading-[16px]">
            {"Play all"}
          </span>
        </button>
      </div>
      <div className="h-px bg-[rgba(0,0,0,0.05)]" />
      <div className="flex flex-col gap-3 px-3 pt-2 pb-3">
        {snippets.map((s, i) => (
          <Snippet key={s.title} title={s.title} avatars={s.avatars} progress={s.progress} delay={delay + 0.1 + 0.1 * i} />
        ))}
      </div>
    </motion.div>
  );
}

type PhaseProps<T> = { content: T; phase: number; setPhase: (n: number) => void };
type MeetingResponse = Extract<Response, { type: "meeting" }>;
type EmailResponse = Extract<Response, { type: "email" }>;
type FeedbackResponse = Extract<Response, { type: "featureRequest" }>;

function MeetingBody({ content: e, phase: r, setPhase: i }: PhaseProps<MeetingResponse>) {
  const line =
    "font-medium text-[12px] text-primary-foreground leading-[16px] tracking-[-0.07px] md:text-[14px] md:leading-[20px]";
  const label = "font-medium text-[12px] text-tertiary-foreground leading-[16px] md:text-[13px] md:leading-[18px]";
  return (
    <>
      <div className="flex h-8 flex-col md:h-10">
        <span className={line}>{e.greeting}</span>
        <StreamText text={e.subtitle} delay={300} speed={20} className={line} onComplete={() => i(2)} />
      </div>
      {r >= 2 && (
        <motion.div
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE_LIST }}
          className="flex w-full flex-col gap-3 md:gap-3.5"
        >
          <StreamText text={e.meetingLabel} delay={100} speed={30} className={label} onComplete={() => i(3)} />
          {r >= 3 && (
            <MeetingCard
              title={e.meeting.title}
              time={e.meeting.time}
              duration={e.meeting.duration}
              startsIn={e.meeting.startsIn}
              avatars={e.meeting.avatars}
              delay={0.1}
            />
          )}
        </motion.div>
      )}
      {r >= 3 && (
        <motion.div
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3, ease: EASE_LIST }}
          className="flex w-full flex-col gap-3 md:gap-3.5"
        >
          <StreamText text={e.taskLabel} delay={700} speed={30} className={label} onComplete={() => i(4)} />
          {r >= 4 && (
            <motion.div
              layout="position"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE_LIST }}
              className="flex flex-col gap-3"
            >
              {e.tasks.map((t, a) => (
                <TaskCard key={a} {...t} delay={0.2 + 0.15 * a} />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}

const GREETING_CLASS =
  "font-medium text-[13px] text-primary-foreground leading-[18px] tracking-[-0.07px] md:text-[14px] md:leading-[20px]";

function EmailBody({ content: e, phase: a, setPhase: r }: PhaseProps<EmailResponse>) {
  return (
    <>
      <div className="px-0.5">
        <StreamText text={e.greeting} delay={300} speed={18} className={GREETING_CLASS} onComplete={() => r(2)} />
      </div>
      {a >= 2 && (
        <EmailCard
          label={e.email.label}
          subject={e.email.subject}
          preview={e.email.preview}
          avatars={e.email.avatars}
          extraCount={e.email.extraCount}
          delay={0.1}
        />
      )}
    </>
  );
}

function FeedbackBody({ content: e, phase: a, setPhase: r }: PhaseProps<FeedbackResponse>) {
  return (
    <>
      <div className="px-0.5">
        <StreamText text={e.greeting} delay={300} speed={18} className={GREETING_CLASS} onComplete={() => r(2)} />
      </div>
      {a >= 2 && <FeedbackCard headerLabel={e.card.headerLabel} snippets={e.card.snippets} delay={0.1} />}
    </>
  );
}

function ResponsePanel({ onComplete, responseIndex = 0 }: { onComplete?: () => void; responseIndex?: number }) {
  const [phase, setPhase] = useState(0),
    cb = useRef(onComplete);
  useEffect(() => {
    cb.current = onComplete;
  });
  const d = RESPONSES[responseIndex],
    showLink = "meeting" === d.type ? phase >= 4 : phase >= 2;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -80 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeInOut", scale: { delay: 0.2, duration: 0.35, ease: "easeInOut" } },
        y: 0,
      }}
      exit={{ filter: "blur(4px)", opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" }, y: -12 }}
      layout
      transition={{ layout: { bounce: 0, duration: 0.4 } }}
      className={cn(
        "relative z-1 max-h-64 origin-center overflow-y-hidden rounded-lg p-2.5 backdrop-blur-xs md:max-h-76 md:rounded-xl md:p-3.5",
        "bg-white-100/90",
      )}
      style={{ boxShadow: SHADOW_GLOW.join(",") }}
    >
      <motion.div layout="position" className="flex flex-col items-start gap-3.5 md:gap-4">
        {"meeting" === d.type ? (
          <MeetingBody content={d} phase={phase} setPhase={setPhase} />
        ) : "email" === d.type ? (
          <EmailBody content={d} phase={phase} setPhase={setPhase} />
        ) : (
          <FeedbackBody content={d} phase={phase} setPhase={setPhase} />
        )}
      </motion.div>
      {showLink && (
        <motion.div
          initial={{ y: 96 }}
          animate={{ y: 0 }}
          layout="position"
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="absolute right-0 bottom-0 left-0 flex h-20 items-end bg-linear-to-b from-transparent via-white-100/80 to-50% to-white-100 px-3.5 pb-3 md:h-24 md:px-5 md:pb-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.25, ease: "easeOut" }}
            onAnimationComplete={() => cb.current?.()}
            className="flex items-center gap-1"
          >
            <ArrowTurnDownRight14 className="size-3 text-accent-foreground md:size-3.5" />
            <span className="text-[11px] text-accent-foreground leading-[14px] md:text-[13px] md:leading-[18px]">
              {d.bottomLink}
            </span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function AskBox({
  state: e = "b_placeholder",
  responseIndex: i = 0,
  onTypingComplete: l,
  onResponseComplete: n,
}: {
  state?: VisualizerState;
  responseIndex?: number;
  onTypingComplete?: () => void;
  onResponseComplete?: () => void;
}) {
  const query = RESPONSES[i].query,
    type = RESPONSES[i].type,
    [showResponse, setShowResponse] = useState(false);
  useEffect(() => {
    if ("f_responding" === e) setShowResponse(true);
    else if ("b_placeholder" === e) setShowResponse(false);
  }, [e]);
  const typing = "c_typing" === e || "d_complete" === e,
    thinking = "e_thinking" === e,
    responding = "f_responding" === e;
  return (
    <div aria-hidden="true" className="relative w-full">
      <motion.div
        layout
        className={cn(
          "flex items-center justify-between",
          "rounded-lg pl-3 md:rounded-xl md:pl-4",
          "bg-white-100",
          "relative z-10 backdrop-blur-[2px]",
        )}
        style={{ boxShadow: SHADOW.join(", ") }}
        animate={"e_thinking" === e ? { scale: 0.96 } : { scale: 1 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        <span className="min-w-0 flex-1 font-medium text-[13px] leading-[18px] md:text-[15px] md:leading-5">
          <AnimatePresence mode="wait">
            {("b_placeholder" === e || "g_finished" === e) && (
              <motion.span
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="text-white-900"
              >
                {"Ask anything"}
                {"b_placeholder" === e && <Dots />}
                {"g_finished" === e && <span>{"..."}</span>}
              </motion.span>
            )}
            {"c_typing" === e && (
              <motion.span
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-primary-foreground"
              >
                <TypedQuery text={query} onComplete={l} />
              </motion.span>
            )}
            {("d_complete" === e || "e_thinking" === e || "f_responding" === e) && (
              <motion.span
                key="complete"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                exit={{ filter: "blur(2px)", opacity: 0 }}
                className="text-primary-foreground"
              >
                {query}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <div className="relative flex flex-1 shrink-0 justify-end overflow-hidden p-1.5 md:w-40 md:p-[9px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {!thinking && !responding && (
              <motion.div
                key="submit"
                initial={{ opacity: 0.3, y: 40 }}
                animate={typing ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
                exit={{ scale: 0.6, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] }, y: -40 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0, 0, 0.2, 1] }}
                className={cn(
                  "flex size-7 items-center justify-center md:size-8",
                  "rounded-lg border border-black-0/10 bg-[#266df0] text-white-100 md:rounded-[9px]",
                )}
                style={{ boxShadow: SHADOW_SUBMIT.join(", ") }}
              >
                <ArrowUp14 className="size-3.5 md:size-4" />
              </motion.div>
            )}
            {thinking && (
              <motion.div
                key="thinking"
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                exit={{ transition: { duration: 0.25, ease: [0.4, 0, 1, 1] }, y: -40 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0, 0, 0.2, 1] }}
                className="flex h-7 items-center md:h-8"
              >
                {"email" === type && (
                  <ToolPill icon={<RecordSearch14 className="size-3.5 text-[#666666]/40" />}>
                    <span className="whitespace-nowrap">{"Searching records"}</span>
                  </ToolPill>
                )}
                {"featureRequest" === type && (
                  <ToolPill icon={<VideoCamera14 className="size-3.5 text-[#666666]/40" />}>
                    <span className="whitespace-nowrap">{"Searching calls"}</span>
                  </ToolPill>
                )}
                {"meeting" === type && <ToolPill>{"Thinking"}</ToolPill>}
              </motion.div>
            )}
            {responding && (
              <motion.div
                key="thought"
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                exit={{ transition: { duration: 0.25, ease: [0.4, 0, 1, 1] }, y: -40 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0, 0, 0.2, 1] }}
                className="flex h-7 items-center md:h-8"
              >
                {"email" === type && (
                  <ToolPill shouldAnimate={false} icon={<RecordSearch14 className="size-3.5 text-[#666666]/40" />}>
                    <span className="whitespace-nowrap">{"Searched records: 4 results"}</span>
                  </ToolPill>
                )}
                {"featureRequest" === type && (
                  <ToolPill shouldAnimate={false} icon={<VideoCamera14 className="size-3.5 text-[#666666]/40" />}>
                    <span className="whitespace-nowrap">{"Searched calls: 1 result"}</span>
                  </ToolPill>
                )}
                {"meeting" === type && <ToolPill shouldAnimate={false}>{"Thought for 3s"}</ToolPill>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="mt-1.5 h-64 md:mt-2 md:h-76">
        <AnimatePresence>{showResponse && <ResponsePanel key="response" responseIndex={i} onComplete={n} />}</AnimatePresence>
      </div>
    </div>
  );
}

function useStepMachine(running: boolean) {
  const [idx, setIdx] = useState(0),
    step = STEPS[idx];
  useEffect(() => {
    if (!running || "until-callback" === step.duration) return;
    const id = setTimeout(() => setIdx((e) => (e + 1) % STEPS.length), step.duration);
    return () => clearTimeout(id);
  }, [running, idx, step.duration]);
  const advance = useCallback(() => {
    if (running) setIdx((e) => (e + 1) % STEPS.length);
  }, [running]);
  return { advance, backgroundState: step.backgroundState, foregroundState: step.foregroundState, stepId: step.id };
}

/** Hero body: visualizer, the server-rendered header, the ask demo and the bottom spacer grid. */
export function AskHero({ header, decoration }: { header: ReactNode; decoration: ReactNode }) {
  const [responseIndex, setResponseIndex] = useState(0),
    [entered, setEntered] = useState(false),
    [running, setRunning] = useState(false),
    { backgroundState, foregroundState, stepId, advance } = useStepMachine(running);
  // Advance the query each time the loop enters "idle" (guarded so a StrictMode effect replay does not skip one).
  const lastStep = useRef<string | null>(null);
  useEffect(() => {
    if ("idle" === stepId && lastStep.current !== "idle") setResponseIndex((e) => (e + 1) % QUERY_COUNT);
    lastStep.current = stepId;
  }, [stepId]);
  const onEntry = useCallback(() => setEntered(true), []),
    start = useCallback(() => setRunning(true), []);
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <AskVisualizer orientation="bottom-to-top" state={entered ? backgroundState : "a_enter"} onEntryComplete={onEntry} />
      <div className="pointer-events-none relative grid flex-1 grid-cols-12">
        <div className="col-[2/-2] flex flex-col items-center justify-center pb-12">
          <div className="pointer-events-auto">{header}</div>
          <motion.div
            className="pointer-events-auto w-full max-w-md origin-bottom"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={entered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: EASE_ENTER }}
            onAnimationComplete={() => {
              if (entered) start();
            }}
          >
            <AskBox
              state={foregroundState}
              responseIndex={responseIndex}
              onTypingComplete={advance}
              onResponseComplete={advance}
            />
          </motion.div>
          {decoration}
        </div>
      </div>
    </div>
  );
}
