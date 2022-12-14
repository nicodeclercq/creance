import React from 'react';

type Component = (props: { children: any}) => JSX.Element;
type Props<A extends Component> = Parameters<A>[0];

type OtherProps<C extends Component> =  Omit<Props<C>, 'children'>;
type Children<C extends Component> = Pick<Props<C>, 'children'>['children'];

export const renderAsChildren = <C extends Component>
  (Component: C, props: OtherProps<C>) =>
  (children: Children<C>) => (
    // @ts-ignore
    <Component {...props}>{children}</Component>
);
