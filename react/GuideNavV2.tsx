import React from "react";
import { canUseDOM, useRuntime, Link } from "vtex.render-runtime";

import { default as s } from "./styles.css";

type GuideNavV2PropsProps = {
  shopAll?: NavObject
  removeBrandName?: string
  querySelector?: string
}

type NavObject = {
  label: string
  link?: string
  index?: number
}

const GuideNavSpacer = () => <div style={{ height: "6.25rem" }} />;

const removeBrand = (inputText: string, brandName: string | undefined) => {
  if (!brandName) return inputText;

  const hasBrandName = inputText.includes(brandName);
  return hasBrandName ? inputText.split(brandName)[1] : inputText;
}

const GuideNavV2Props = ({ shopAll, querySelector, removeBrandName }: GuideNavV2PropsProps) => {
  if (!canUseDOM) return <GuideNavSpacer />;

  const { deviceInfo: { isMobile } } = useRuntime();

  const allSectionsNodeList = document.querySelectorAll(querySelector || "[data-nav-link]");
  if (!allSectionsNodeList) return <GuideNavSpacer />;

  const allSections: NavObject[] = Array.from(allSectionsNodeList).map((section, index) => {
    const element = section as HTMLElement;
    const substituteText = element.dataset.navLink;
    let returnedLabel = substituteText || "";

    if (!substituteText) {
      // All product card secitons have an [aria-labelledby] by default and point to the title of the product card.
      const ariaLabelledBy = element.attributes.getNamedItem("aria-labelledby");
      const elementInnerText = element.innerText;

      if (ariaLabelledBy) {
        const labelElement = element.querySelector(`#${ariaLabelledBy.value}`) as HTMLElement | null;
        returnedLabel = labelElement ? removeBrand(labelElement.innerText, removeBrandName) : elementInnerText;
      } else {
        // element is not a product card AND does not have substitute text. Example: About ERIK'S
        returnedLabel = elementInnerText;
      }
    }

    return {
      label: returnedLabel,
      link: element.id,
      index
    }
  });

  return (
    <>
      <style>{`html {scroll-padding-top: 1rem;}`}</style>
      <nav aria-label="Page Navigation" className={s.container}>
        {shopAll &&
          <Link to={shopAll?.link} className={s.shopAllLink} data-ebs-red-button style={{ width: "100%" }}>
            Shop All {shopAll?.label}
          </Link>}
        <ul className={s.navList}>
          {allSections.map(({ label, link, index }) => (
            <li key={`${label}-${index}`} className={s.navItem}>
              <a href={`#${link}`} className={s.navLink}>{!isMobile && "- "}{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

GuideNavV2Props.schema = {
  title: "GuideNavV2Props",
  description: "",
  type: "object",
  properties: {
    name: {
      title: "Name",
      description: "",
      type: "string",
      widget: { "ui:widget": "textarea" }
    }
  }
};

export default GuideNavV2Props
