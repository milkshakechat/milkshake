import styled from "styled-components";

interface HorizontalProps {
  readonly justifyContent?:
    | "flex-start"
    | "center"
    | "space-evenly"
    | "space-between"
    | "flex-end"
    | "space-around";
  readonly verticalCenter?: boolean;
  readonly baseline?: boolean;
  readonly spacing?: 1 | 2 | 3 | 4 | 5;
  readonly flex?: number;
  readonly flexWrap?: boolean;
  readonly alignItems?: "flex-start" | "center" | "flex-end";
  readonly height?: string;
  readonly width?: string;
  readonly overflowHidden?: boolean;
  readonly position?: "absolute" | "relative";
  padding?: string;
}
const SPACING_VALS = [4, 8, 16, 24, 48];

export const $Horizontal = styled.div<HorizontalProps>`
  display: flex;
  flex-direction: row;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) =>
    props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${(props) => props.verticalCenter && "align-items: center;"};
  ${(props) => props.baseline && "align-items: baseline;"};
  ${(props) => props.flexWrap && "flex-wrap: wrap;"};
  ${(props) => props.alignItems && `align-items: ${props.alignItems};`};
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.overflowHidden && `overflow: hidden;`}
  ${(props) => props.position && `position: ${props.position};`}
  ${(props) => props.padding && `padding: ${props.padding};`}
  

  & > *:not(:last-child) {
    margin-right: ${(props) =>
      props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`;

export const $Vertical = styled.div<{
  spacing?: 1 | 2 | 3 | 4 | 5;
  flex?: number;
  width?: string;
  minWidth?: string;
  height?: string;
  padding?: string;
  maxWidth?: string;
  justifyContent?: string;
  alignItems?: string;
}>`
  display: flex;
  flex-direction: column;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) => props.width && `width: ${props.width};`};
  ${(props) => props.height && `height: ${props.height};`};
  ${(props) => props.padding && `padding: ${props.padding};`}
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth};`}
  ${(props) =>
    props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${(props) => props.justifyContent && `align-items: ${props.alignItems};`}
  ${(props) => props.minWidth && `min-width: ${props.minWidth};`}
  & > *:not(:last-child) {
    margin-bottom: ${(props) =>
      props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`;
