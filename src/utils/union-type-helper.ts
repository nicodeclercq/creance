export const fold = <InputType extends string, OutputType>(
  actions: {
    [key in InputType]: (type: InputType) => OutputType;
  },
) => (type: InputType) => {
  try{
    return actions[type](type);
  }
  catch(e){
    console.error('Union type error:', type, actions);
    throw e;
  }
};
