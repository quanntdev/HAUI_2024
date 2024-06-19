const tranformDescription = (string:string) => {
  let index = 1;
  let replacedStr = string?.replace(/<img\s+src="[^"]*"\s*\/?>/gi, function(match) {
    return match.replace(/src="[^"]*"/i, 'src="' + index++ + '"');
  });

  let indexFile = 1;
  replacedStr = replacedStr?.replace(/<a[^>]*style="[^"]*"[^>]*>/gi, function(match) {
    return match.replace(/href="#"/i, `href="${indexFile++}"`);
  });
  return replacedStr
};

export default tranformDescription;
