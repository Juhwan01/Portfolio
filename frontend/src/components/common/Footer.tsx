import { SOCIAL_LINKS } from '@utils/constants'

const Footer = () => {
  return (
    <footer aria-label="사이트 푸터" className="w-full py-12 border-t border-[#48474d]/15 bg-[#0e0e13]">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 max-w-7xl mx-auto gap-6 text-sm tracking-widest uppercase">
        <div className="text-lg font-black text-[#f9f5fd]">정주환</div>
        <div className="flex gap-8 text-[#acaab1]">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#a8a4ff] transition-colors duration-200 opacity-80 hover:opacity-100"
          >
            Github
          </a>
          <a
            href={SOCIAL_LINKS.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#a8a4ff] transition-colors duration-200 opacity-80 hover:opacity-100"
          >
            Blog
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="hover:text-[#a8a4ff] transition-colors duration-200 opacity-80 hover:opacity-100"
          >
            Email
          </a>
        </div>
        <div className="text-[#acaab1] text-[10px]">
          &copy; {new Date().getFullYear()} 정주환 — AI 엔지니어
        </div>
      </div>
    </footer>
  )
}

export default Footer
