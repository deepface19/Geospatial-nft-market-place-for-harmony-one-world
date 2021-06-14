const themeSwitch = document.getElementById("themeSwitch");
const themeIcons = document.querySelectorAll(".theme-toggler .theme-options span");

const initTheme = () => {
  const isLightTheme = 
    localStorage.getItem("pageTheme") !== null &&
    localStorage.getItem("pageTheme") === "light";

  themeSwitch.checked = isLightTheme;

  if (isLightTheme) {
    document.body.classList.remove("dark-edition")
    document.body.classList.add("light-edition")
  }
  
  const themeIcon = [...themeIcons].find(item => {
    return isLightTheme ?
      item.classList.contains("light-mode") :
      item.classList.contains("dark-mode");
  });
  themeIcon.classList.add("active");
};

const updateTheme = () => {
  if (themeSwitch.checked) {
    document.body.classList.remove("dark-edition");
    document.body.classList.add("light-edition");
    localStorage.setItem("pageTheme", "light");
  } else {
    document.body.classList.remove("light-edition");
    document.body.classList.add("dark-edition");
    localStorage.setItem("pageTheme", "dark");
  }

  themeIcons.forEach(icon => icon.classList.toggle("active"));
};

if (themeSwitch) {
  initTheme();
  themeSwitch.addEventListener("change", updateTheme);
}
