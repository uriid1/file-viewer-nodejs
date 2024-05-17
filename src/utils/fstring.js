const fstring = (template, data) => {
  for (const key in data) {
    template = template.replace(new RegExp('\\$' + key, 'g'), data[key]);
  }

  return template;
}

export default fstring;
