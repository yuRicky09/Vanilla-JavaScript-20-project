const caclulate = async function () {
  const res = await fetch("item.json");
  const data = await res.json();
  console.log(data);
  document.body.innerHTML = `<h1>${data[0].text}</h1>`;
};

caclulate();
