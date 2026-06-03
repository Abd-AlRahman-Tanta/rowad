// Version A (legacy) navbar types
export type NavBarLangProps = {
  text: string;
  icon: string;
}

export type MainLinkProps = {
  id: string;
  text: string;
  component?: string;
}

export type NavBarWhatsAppProps = {
  text: string;
  link: string;
  icon?: string;
}

export type NavBarLogoProps = {
  icon: string;
  link: string;
}

export type NavBarProps = {
  navBarLang: NavBarLangProps;
  navBarLogo: NavBarLogoProps;
  mainLinks: MainLinkProps[];
  navBarWhatsApp: NavBarWhatsAppProps;
}
export type HeroProps = {
  heroTitle?: string,
  heroDescription?: string,
  heroBackground?: string,
  heroProfileImage?: string,
  heroCoursesButton?: {
    id: string,
    text: string
  }
  heroProjectsButton?: {
    id: string,
    text: string
  }
}
export type FooterSocialMediaLinkProps = {
  link: string,
  icon: string
}
export type FooterContactProps = {
  text: string,
  icon: string,
  link: string
}
export type FooterProps = {
  footerLogo: string,
  footerSocialMediaLinks: FooterSocialMediaLinkProps[],
  siteMapTitle: string,
  siteMap: MainLinkProps[],
  contactTitle: string,
  contactInformations: FooterContactProps[],
  footerRightsText: string
}

