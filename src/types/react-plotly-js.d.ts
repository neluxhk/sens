declare module "react-plotly.js" {
  import * as React from "react";
  import { Layout, Data, Config } from "plotly.js";

  export interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
    onUpdate?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
  }

  export default class Plot extends React.Component<PlotParams> {}
}
