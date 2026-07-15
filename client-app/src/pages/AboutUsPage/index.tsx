import type { ReactNode } from 'react';
import { Mail, Code2, Server, Palette, Compass, ShieldCheck, Cloud } from 'lucide-react';

type TeamRole = 'frontend' | 'backend' | 'lead';

interface TeamMember {
  name: string;
  role: string;
  email?: string;
  team: TeamRole;
  icon: ReactNode;
}

const roleStyles: Record<TeamRole, { bg: string; text: string; ring: string }> = {
  frontend: { bg: 'bg-teal-50',   text: 'text-[#0d9488]', ring: 'ring-teal-200' },
  backend:  { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
  lead:     { bg: 'bg-amber-50',  text: 'text-amber-600', ring: 'ring-amber-200' },
};

const members: TeamMember[] = [
  { name: 'Ramin Buzarpur',             role: 'Frontend Team',            email: 'raminbuzarpur@gmail.com',                team: 'frontend', icon: <Code2 className="w-6 h-6" /> },
  { name: 'Mohammadhosein Fathali',     role: 'Frontend Team',            email: 'mhfathali2003@gmail.com',                team: 'frontend', icon: <Code2 className="w-6 h-6" /> },
  { name: 'Mohammadreza Yousefi',       role: 'Frontend Team · Figma',    email: 'mryousefi123456@gmail.com',              team: 'frontend', icon: <Palette className="w-6 h-6" /> },
  { name: 'Mohammadreza Farahbakhsh',   role: 'Backend Team',             email: 'Moreza.farahbakhsh@gmail.com',           team: 'backend',  icon: <Server className="w-6 h-6" /> },
  { name: 'Ilya Jahed',                 role: 'Backend Team · DevOps',    email: 'ilyajahed.w2004@gmail.com',              team: 'backend',  icon: <Cloud className="w-6 h-6" /> },
];

const leadership: TeamMember[] = [
  { name: 'Delara Jalali',          role: 'Product Owner', team: 'lead', icon: <Compass className="w-6 h-6" /> },
  { name: 'Amirmohammad Azizi',     role: 'Scrum Master',   team: 'lead', icon: <ShieldCheck className="w-6 h-6" /> },
];

const initials = (name: string) =>
  name.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase();

const MemberCard = ({ member }: { member: TeamMember }) => {
  const style = roleStyles[member.team];
  return (
    <div
      className="bg-white rounded-[16px] p-6 flex items-center gap-4"
      style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
    >
      <div className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center ${style.bg} ${style.text} ring-2 ${style.ring} font-semibold text-[18px] flex-shrink-0`}>
        {initials(member.name)}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[#1F2937] text-[18px] font-medium truncate">{member.name}</p>
        <span className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[13px] font-medium ${style.bg} ${style.text}`}>
          {member.icon}
          {member.role}
        </span>
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-1.5 text-[14px] text-gray-500 hover:text-[#14B8A6] transition-colors truncate"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            {member.email}
          </a>
        )}
      </div>
    </div>
  );
};

const AboutUsPage = () => {
  return (
    <div className="bg-[#F3F4F6] py-10 px-6 lg:px-10">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-8">

        {/* Hero */}
        <div
          className="rounded-[16px] p-10 text-center flex flex-col items-center gap-3 text-white"
          style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #078C80 100%)', boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
        >
          <span className="uppercase tracking-[4px] text-[14px] opacity-90">Team</span>
          <h1 className="text-[48px] font-semibold" style={{ fontFamily: '"Gveret Levin", cursive' }}>MA3IR</h1>
          <p className="text-[18px] opacity-90 max-w-[560px]">
            Five Computer Engineering students at Iran University of Science and Technology,
            building Gatherly from the ground up.
          </p>
        </div>

        {/* About Gatherly */}
        <div
          className="bg-white rounded-[16px] p-8 flex flex-col gap-4"
          style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
        >
          <h2 className="text-[#1F2937] text-[24px] font-semibold">About Gatherly</h2>
          <p className="text-[#1F2937] text-[16px] leading-relaxed">
            Gatherly is a social platform for creating, discovering, and joining events. Host a small
            meetup or a large gathering, pick the exact location on a map, and share it with people
            who want to join. Browse a personalized feed of upcoming events, RSVP with a single click,
            follow other members, and keep track of everything you're hosting or attending — all from
            your own profile.
          </p>
        </div>

        {/* Team */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#1F2937] text-[24px] font-semibold px-2">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {members.map((m) => (
              <MemberCard key={m.email} member={m} />
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#1F2937] text-[24px] font-semibold px-2">Project Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {leadership.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;
