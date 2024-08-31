import React from "react";
import styled from "styled-components";
import { color, layout, space } from "styled-system";

// require.contextを使って、public/svgディレクトリ内のすべてのSVGファイルを読み込む
const svgContext = require.context("../../public/svg", false, /\.svg$/);

const icons = {};

// svgContext.keys()で得たファイルパスを用いて動的にアイコンを生成
svgContext.keys().forEach((key) => {
    const iconName = key.replace("./", "").replace(".svg", "");
    const SvgComponent = svgContext(key);

    // SvgComponentがオブジェクトで、defaultエクスポートが存在するか確認
    if (SvgComponent && SvgComponent.default) {
        icons[iconName] = styled(SvgComponent.default)(color, layout, space);
    } else {
        console.error(`Failed to load icon: ${iconName}`);
    }
});

export const Icon = ({ name, ...props }) => {
    const SvgIcon = icons[name];

    return SvgIcon ? <SvgIcon {...props} /> : null;
};
