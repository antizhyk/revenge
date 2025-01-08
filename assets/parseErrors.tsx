  const parseErrors = (errorObject) => {
    const parsedErrors = [];
    for (const key in errorObject) {
      if (errorObject[key].length > 0) {
        parsedErrors.push(...errorObject[key]);
      }
    }
    return parsedErrors;
  };

  export default parseErrors;