import { Func } from './functions';

export const groupBy = <A>(predicate: Func<[A], boolean>) => (arr: A[]): [A[], A[]] => arr.reduce(
  ([pass, dontPass], cur) => {
    if(predicate(cur)){
      pass.push(cur);
    }else{
      dontPass.push(cur);
    }
    return [pass, dontPass];
  },
  [[], []] as [A[], A[]]
)

export const flat = <A>(arr: A[][]): A[] => arr.flat();