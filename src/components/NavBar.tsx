import { BsGithub } from "react-icons/bs";
import { HiSquare3Stack3D } from "react-icons/hi2";

export default function NavBar() {
  return (
    <nav className="bg-subLight text-subDark mb-4 flex w-full flex-col items-start justify-between gap-4 rounded-4xl p-10 md:flex-row md:gap-0">
      <div className="flex flex-col gap-1">
        <p className="font-point-bold text-4xl tracking-wider">
          Hello!
          <span className="font-wagon-italic">
            {" "}
            I'm <b>Yujin</b>,
          </span>
        </p>
        <p className="font-point-dot text-2xl">
          Frontend Developer.<span className="text-sm">★</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href="https://github.com/yummjin"
          className="hover:text-subWhite font-point-dot flex items-center gap-1 text-xl"
          target="_blank"
        >
          github
          <BsGithub size={16} />
        </a>
        <a
          href="https://velog.io/@yummjin"
          className="hover:text-subWhite font-point-dot flex items-center gap-1 text-xl"
          target="_blank"
        >
          velog
          <HiSquare3Stack3D size={18} />
        </a>
      </div>
    </nav>
  );
}
