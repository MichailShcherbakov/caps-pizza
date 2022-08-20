import Article, { ArticleProps } from "../article";
import Section, { SectionProps } from "./section";

export interface ArticleSectionProps
  extends Pick<SectionProps, "id">,
    Omit<ArticleProps, "text"> {
  children?: string;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({
  id,
  title,
  collapse,
  children = "",
}) => {
  return (
    <Section id={id}>
      <Article title={title} text={children} collapse={collapse} />
    </Section>
  );
};

export default ArticleSection;
