import styled from "styled-components";
import {
    compose,
    space,
    layout,
    flexbox,
    border,
    position,
    shadow,
    typography,
    grid,
    style,
} from "styled-system";
import shouldForwardProp from "@styled-system/should-forward-prop";
// gapを定義
const gap = style({
    prop: "gap",
    cssProperty: "gap",
});
export const Box = styled("div").withConfig({ shouldForwardProp })(
    compose(space, layout, flexbox, border, position, shadow, typography, grid, gap),
    (props) => {
        return {
            backgroundColor: props.bg ? props.theme.colors[props.bg] : "initial", // テーマの色を参照
            color: props.color ? props.theme.colors[props.color] : "inherit", // テーマの文字色を参照
        };
    }
);
