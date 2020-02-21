import './sketch-switcher.css';

const storage = window.localStorage;

export default function sketchSwitcher(sketches = [], container) {
  let activeIdx = +storage.getItem('activeIdx') || 0;
  activeIdx = activeIdx < sketches.length ? activeIdx : 0;

  let currentSketch = null;
  let liElems = [];

  const switcherElem = document.createElement('ul');

  const makeList = () => {
    sketches.forEach((_, idx) => {
      const li = document.createElement('li');
      li.dataset.id = idx;
      switcherElem.appendChild(li);
      liElems.push(li);
    });
    switcherElem.setAttribute('id', 'switcher');
    document.body.appendChild(switcherElem);
  };

  const setActiveClass = () => {
    liElems.forEach((li, idx) => {
      if (activeIdx !== idx) {
        li.classList.remove('active');
      } else {
        li.classList.add('active');
      }
    });
  };

  const displaySketch = (idx) => (currentSketch = new sketches[idx](container));

  switcherElem.addEventListener('click', ({ target }) => {
    if (target.tagName === 'LI') {
      currentSketch && currentSketch.stop();
      activeIdx = Number(target.dataset.id);
      storage.setItem('activeIdx', activeIdx);

      displaySketch(activeIdx);
      setActiveClass();
    }
  });

  makeList();
  setActiveClass();
  displaySketch(activeIdx);
}
