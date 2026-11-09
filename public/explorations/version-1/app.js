const projects = [
{slug:'xchange',title:'Xchange',number:'01',category:'Product design · Community',year:'2022–present',image:'1/xcfhr3.png',alt:'Xchange book exchange app screens',description:'Helping books find their next reader.',deck:'A community book exchange initiative, translated into a mobile experience for discovering books and arranging local swaps.',role:'Co-founder · UX & visual design',context:'Community initiative & app prototype',sections:[
['context','The context','Helping books reach another reader.','Xchange began as a community book exchange initiative. The digital concept brings the same idea to a mobile app: list a book, discover something nearby, and connect with another reader.'],
['contribution','My contribution','From the initiative to the interface.','I co-founded Xchange and led the visual design and user experience, from the early concept through the mobile app prototype in Figma.'],
['experience','The experience','Discover, connect, exchange.','The prototype includes a book feed, search and filtering, individual book details, and chat. Together, these screens show the path from finding a title to arranging an exchange.','1/frame-4.png','Xchange prototype: discovery, book details, messaging, and personal collections.'],
['structure','The structure','Connecting the screens and navigation.','The visual system pairs a navy foundation with clear navigation and familiar book imagery. The style guide and site map document how the interface and its sections fit together.','1/frame-3.png','Xchange visual system and app information architecture.'],
['reflection','Looking ahead','Testing the exchange flow next.','The community initiative includes book drives and an exchange network alongside the app prototype. The next step for the digital product is to test the exchange flow with readers and document what changes as a result.']
]},
{slug:'franklins',title:'Franklin’s',number:'02',category:'UX / UI · Website redesign',year:'2026',image:'2/cover-new.png',alt:'Franklin’s redesigned restaurant website',description:'Bringing a neighborhood café’s warmth online.',deck:'A website redesign exploring clearer menu navigation, mobile browsing, and a digital experience that reflects the café.',role:'UX designer · Menu page lead',context:'Collaborative website redesign',sections:[
['context','The context','Helping visitors find the menu.','The project explored how Franklin’s website could better reflect the restaurant and help visitors find its menu and other essential information.'],
['contribution','My contribution','Starting with the menu.','I led the menu page redesign, focusing on navigation, content hierarchy, and mobile usability. I also collaborated on the remaining pages to keep the experience cohesive.'],
['experience','The experience','Make the menu easier to explore.','The redesign groups menu content and gives visitors a consistent way to navigate between categories.','2/menu.png','Franklin’s menu design.'],
['structure','Menu layout','Organizing the menu.','The menu groups dishes into categories so visitors can browse the available options.','2/menu-mobile.png','Redesigned menu layout.'],
['reflection','Looking ahead','Evaluating the proposed redesign.','This project presents a proposed interface. Usability evaluation would help establish whether visitors can find the information they need more easily.']
]},
{slug:'cogniva',title:'Cogniva',number:'03',category:'Interaction concept',year:'2026',image:'3/robot-1.png',alt:'Cogniva companion robot concept',description:'Exploring companionship in elder care.',deck:'A socially assistive companion concept exploring how shared stories and activities could support connection in nursing homes.',role:'UX designer · Team of four',context:'SCAD StartUp Competition',sections:[
['context','The context','Supporting moments of connection.','Cogniva explores emotional isolation among nursing home residents and how technology might support shared experiences without replacing human care.'],
['contribution','My contribution','Research, flows, and interaction concepts.','I contributed to user research, concept development, user flows, and high-fidelity prototypes in Figma, working with a team of four.'],
['experience','The concept','Three ways to spend time together.','Life Link focuses on preserving and sharing personal stories. Bridge Mode explores one-on-one conversations and guided activities. Circle Connect brings together small groups around shared interests.','3/robot-2.png','Cogniva robot and interface concept.'],
['reflection','Looking ahead','Taking the concept into testing.','Cogniva placed third at the SCAD StartUp Competition. It remains a concept; prototyping and testing with residents would be needed to evaluate usability and real-world value.']
]}
];
projects.push({slug:'ixigo',title:'Ixigo',number:'04',category:'UX / UI · Internship',year:'2026',image:'4/cover.png',alt:'Ixigo airport cab booking project',description:'Airport cab booking, from wireframe to handoff.',deck:'Wireframes and high-fidelity interfaces for airport cab booking, including Live Activity notifications, within Ixigo’s existing design system.',role:'UX Design Intern',context:'Ixigo · June–August 2026',sections:[['context','Overview','An airport cab booking experience.','During my internship at Ixigo, I worked on wireframes and high-fidelity interfaces for the airport cab booking flow.'],['contribution','My contribution','From wireframes to high fidelity.','The work covered the booking flow and screens prepared for handoff, following the product’s existing design system.'],['experience','Live Activity','Booking status at a glance.','Live Activity notifications explored how riders could see cab booking status from the lock screen without opening the app.'],['reflection','Design system','Working within an established product.','The flow followed Ixigo’s existing design system to keep the experience consistent with the rest of the product.']]});
const direction = 'a';
let currentPage = new URLSearchParams(location.search).get('page') || 'home';
const url=(hash='home')=>`?direction=${direction}&mode=${colorMode}&hero=${heroVariant}&work=${workLayout}#${hash}`;
const image=(p)=>`../assets/projects/${p}`;
let savedMode;try{savedMode=localStorage.getItem('hridya-preview-mode');}catch{}
let colorMode = new URLSearchParams(location.search).get('mode') || savedMode || 'light';
if(!['light','dark'].includes(colorMode))colorMode='light';
let savedHero;try{savedHero=localStorage.getItem('hridya-preview-hero-v2');}catch{}
let heroVariant=new URLSearchParams(location.search).get('hero')||savedHero||'heart';
if(!['name','heart','birds','butterfly'].includes(heroVariant))heroVariant='heart';
let savedWork;try{savedWork=localStorage.getItem('hridya-preview-work-v2');}catch{}
let workLayout=new URLSearchParams(location.search).get('work')||savedWork||'minimal';
if(!['minimal','split','gallery','list','poster'].includes(workLayout))workLayout='minimal';
let disposeHero=()=>{};

function applyMode(){
  document.body.dataset.mode=colorMode;
  document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===colorMode)));
  document.querySelectorAll('a[href^="?direction="]').forEach(link=>{const destination=new URL(link.href);destination.searchParams.set('mode',colorMode);destination.searchParams.set('hero',heroVariant);destination.searchParams.set('work',workLayout);link.setAttribute('href',destination.search+destination.hash);});
  history.replaceState(null,'',`?direction=a&mode=${colorMode}&hero=${heroVariant}&work=${workLayout}&page=${currentPage}${location.hash}`);
}
const socialLinks=()=>`<a href="https://www.linkedin.com/in/hridyachopra" target="_blank" rel="noopener" aria-label="Hridya on LinkedIn">LinkedIn ↗</a><a href="mailto:choprahridya@gmail.com" aria-label="Email Hridya">choprahridya@gmail.com ↗</a>`;
function header(){return `<header class="site-header"><a class="wordmark" href="${url()}" aria-label="Hridya Chopra — home">hridya chopra<span class="wordmark-dot">.</span></a><nav aria-label="Main navigation"><a href="${url('work')}">Work</a><a href="${url('about')}">About</a><a class="resume-link" href="../assets/resume.pdf" target="_blank" rel="noopener">Resume ↗</a></nav></header>`;}
function footer(){return `<footer class="compact-footer wrap"><div><h2>Let’s connect.</h2><a class="footer-email" href="mailto:choprahridya@gmail.com">choprahridya@gmail.com <span aria-hidden="true">↗</span></a></div><div class="compact-footer-links"><a href="https://www.linkedin.com/in/hridyachopra" target="_blank" rel="noopener">LinkedIn ↗</a><a href="../assets/resume.pdf" target="_blank" rel="noopener">Resume ↗</a><span>© 2026 Hridya Chopra</span></div></footer>`;}
function screenCrop(viewBox,label){return `<div class="phone-frame"><svg viewBox="${viewBox}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet"><image href="${image('1/frame-4.png')}" x="0" y="0" width="2088" height="1480" preserveAspectRatio="none"/></svg></div>`;}
function workArtwork(slug){
 if(slug==='xchange')return `<div class="work-artwork exchange-art" role="group" aria-label="Xchange app: discover books and arrange an exchange through chat"><div class="discovery-screen">${screenCrop('1060 238 211 458','Xchange book discovery screen')}</div><div class="chat-screen">${screenCrop('1290 820 212 458','Xchange chat screen')}</div></div>`;
 return `<div class="work-artwork menu-art" role="group" aria-label="Franklin’s redesigned menu browsing screen"><div class="menu-redesign preview-browser"><div class="browser-chrome" aria-hidden="true"><i></i><i></i><i></i></div><img src="${image('2/menu-mobile.png')}" alt="Franklin’s redesigned menu browsing interface" loading="lazy"></div></div>`;

}
const homeSummaries={
 xchange:{description:'A book exchange app concept for local readers.',role:'Co-founder · UX and visual design',type:'Product design'},
 franklins:{description:'A redesigned menu for a neighborhood café.',role:'Menu page lead · UX and interface design',type:'Website redesign'},
 cogniva:{description:'A companion concept for connection in elder care.',role:'UX designer · Team of four',type:'Interaction concept'},
 ixigo:{description:'Airport cab booking and Live Activity design at Ixigo.',role:'UX Design Intern · June–August 2026',type:'Product design · Internship'}
};
function projectSpread(p){const copy=homeSummaries[p.slug];let art;
 if(p.slug==='xchange'||p.slug==='franklins')art=workArtwork(p.slug);
 else if(p.slug==='cogniva')art=`<div class="spread-concept"><img src="${image('3/robot-1.png')}" alt="Cogniva companion robot concept" loading="lazy"></div>`;
 else art=`<div class="spread-internship"><img src="${image('4/cover.png')}" alt="Ixigo" loading="lazy"></div>`;
 const media=`<div class="spread-art">${art}</div>`;
 const content=`<div class="spread-copy"><h3>${p.title}</h3><div class="spread-meta"><span>${copy.type}</span><span>${p.year}</span></div><p class="spread-description">${copy.description}</p><p class="spread-role">${copy.role}</p><span class="spread-action">View case study<span class="visually-hidden">: ${p.title}</span></span></div>`;
 return `<a class="project-spread project-spread-${p.slug}" href="${url(p.slug)}">${['split','list'].includes(workLayout)?content+media:media+content}</a>`;
}
function projectGrid(){return `<section class="home-work wrap" id="selected"><div class="home-work-heading"><h2>Selected work<span>.</span></h2></div><div class="project-spreads work-layout-${workLayout}">${projects.map(projectSpread).join('')}</div></section>`;}
function home(){const art=heroVariant!=='name';return `<main id="main"><section class="cover-hero wrap ${art?'':'cover-name-only'} ${heroVariant==='heart'?'cover-heart':''}"><div class="cover-copy"><div class="cover-intro"><p class="cover-greeting">Hi, I’m</p></div><h1>Hridya <span>Chopra.</span></h1><p class="cover-description">UX design student at SCAD.<br><span>Previously a UX design intern at Ixigo.</span></p><a class="cover-work-link" href="#selected">View selected work</a></div>${art?`<div class="cover-art"><canvas id="hero-sculpture" ${['butterfly','heart'].includes(heroVariant)?'role="button" tabindex="0" aria-pressed="false" aria-describedby="hero-art-help"':'role="img"'} aria-label="${heroVariant==='heart'?'A sculpted blue heart':heroVariant==='birds'?'Three blue birds in flight':'A blue butterfly with patterned wings'}, drawn in ASCII characters${heroVariant==='butterfly'?'. Drag or use arrow keys to turn. Click or press Enter to open the wings. Escape resets the view.':heroVariant==='heart'?'. Drag or use arrow keys to turn. Click or press Enter for a pulse. Escape resets the view.':''}"></canvas>${['butterfly','heart'].includes(heroVariant)?`<p class="art-help" id="hero-art-help">Drag to turn · ${heroVariant==='heart'?'Press to pulse':'Press to open the wings'}</p>`:''}</div>`:''}</section>${projectGrid()}<section class="home-about wrap"><div><h2>Beyond the work.</h2></div><div><p>I’m studying UX design at SCAD. My projects span a community book exchange, a neighborhood café, and a companion concept for elder care.</p><a class="text-link" href="${url('about')}">More about me</a></div></section></main>${footer()}`;}
function sectionLabel(section){const label=section[1].replace(/^The /,'').replace(/^My contribution$/,'My role');return label.charAt(0).toUpperCase()+label.slice(1);}
const caseSections={
 xchange:[
 ['context','The problem','Books need a way to reach another reader.','Xchange began as a community book exchange initiative. The app concept extends that idea: readers can list a book, find a title nearby, and arrange a local exchange.'],
 ['contribution','My role','Co-founding the initiative and designing the app.','I co-founded Xchange and led the UX and visual design, developing the concept into a Figma prototype.'],
 ['experience','The design','A path from discovery to exchange.','The prototype connects a book feed, search and filters, book details, and chat. These screens show how a reader could find a title and contact its owner to arrange a swap.','1/frame-4.png','Prototype screens covering discovery, book details, chat, and personal collections.'],
 ['structure','Navigation and visual system','Keeping the exchange flow connected.','The site map organizes the app’s sections. A navy visual system and consistent navigation bring the discovery, listing, and messaging screens together.','1/frame-3.png','App information architecture and visual system.'],
 ['reflection','Status and next steps','The exchange flow still needs testing.','The community initiative includes book drives and an exchange network. The digital product remains a prototype; the next step is to test whether readers can find a book and arrange an exchange, then revise the flow from those observations.']
 ],
 franklins:[
 ['context','The problem','Helping visitors find and browse the menu.','The redesign explored how Franklin’s website could reflect the café while making its menu and essential information easier to find.'],
 ['contribution','My role','Leading the menu page redesign.','I led the menu page work, focusing on navigation, content hierarchy, and interface design. I also collaborated on the other pages to keep the website consistent.'],
 ['experience','The design','Organizing the menu around categories.','The proposed menu groups dishes into categories and gives visitors a consistent way to move between them. The designs below show the menu structure and its presentation.','2/menu.png','Menu page design.'],
 ['structure','Menu detail','Keeping browsing and dish information together.','The redesigned menu combines category navigation with dish cards, keeping names, descriptions, and prices within the browsing view.','2/menu-mobile.png','Redesigned category navigation and dish cards.'],
 ['reflection','Status and next steps','A proposal to evaluate with visitors.','These designs show a proposed interface. Testing should establish whether visitors can find a category, compare dishes, and locate the information they need. No usability improvement is claimed here.']
 ],
 cogniva:[
 ['context','The problem','Exploring social connection in elder care.','Cogniva explores how a socially assistive companion could support shared experiences among nursing home residents without replacing human care.'],
 ['contribution','My role','Research and interaction design in a team of four.','I contributed to research, concept development, user flows, and high-fidelity Figma prototypes for the SCAD StartUp Competition.'],
 ['experience','The concept','Three ways to spend time together.','Life Link explores preserving personal stories. Bridge Mode supports one-on-one conversations and guided activities. Circle Connect brings small groups together around shared interests.','3/robot-2.png','Cogniva companion and interface concept.'],
 ['reflection','Status and next steps','Competition recognition, with testing still ahead.','Cogniva placed third at the SCAD StartUp Competition. It remains a concept. Prototyping with residents and care staff would be needed to understand its usability and value in a care setting.']
 ],
 ixigo:[
 ['context','The project','Designing an airport cab booking flow.','During my Ixigo internship, I worked on wireframes and high-fidelity interfaces for airport cab booking, following the product’s existing design system.'],
 ['contribution','My role','Taking booking screens from wireframes to handoff.','My work covered the booking flow, high-fidelity screens, and preparation for handoff.'],
 ['experience','Interface decisions','Showing booking status without opening the app.','The work included Live Activity notifications, exploring how riders could see cab booking status from the lock screen.'],
 ['reflection','Available material','The interface work is not shown here yet.','This page summarizes the scope of my internship. The current portfolio materials include the Ixigo identity image, but no booking screens or documented results to present.']
 ]
};
function caseStudy(p){
 const sections=caseSections[p.slug];
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 return `<main id="main" class="case-page wrap"><a class="back" href="${url('work')}">Back to selected work</a>
 <header class="case-head"><div><p class="eyebrow">${p.category}</p><h1>${p.title}</h1><p class="case-deck">${p.deck}</p></div><dl class="facts"><div><dt>My role</dt><dd>${p.role}</dd></div><div><dt>Project</dt><dd>${p.context}</dd></div><div><dt>Year</dt><dd>${p.year}</dd></div></dl></header>
 <article class="case-body" aria-label="${p.title} case study">${sections.map((section,index)=>`<section class="story-section ${section[4]?'story-with-media':''}" id="${section[0]}"><div class="story-heading"><p class="story-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</p><h2>${section[1]}</h2></div><div class="story-copy"><h3>${section[2]}</h3><p>${section[3]}</p></div>${section[4]?`<figure><img src="${image(section[4])}" alt="${section[5]}" loading="lazy"><figcaption><span>${section[5]}</span><a class="figure-link" href="${image(section[4])}" target="_blank" rel="noopener">View full-size image<span class="visually-hidden">: ${p.title}, ${section[1]}</span></a></figcaption></figure>`:''}</section>`).join('')}</article>
 <a class="next" href="${url(next.slug)}"><div><p class="eyebrow">Next project</p><h2>${next.title}</h2></div><span class="next-cta">View ${next.title} case study</span></a></main>${footer()}`;
}
function about(){
const skills=['UX research','Information architecture','Wireframing','Prototyping','Testing','Design systems','AI-assisted design'];
const tools=['Figma','Claude','Adobe Photoshop','Adobe Illustrator','Canva','Rhino','Keyshot'];
return `<main id="main" class="about-page wrap"><div class="about-layout"><aside class="about-sidebar"><img class="about-portrait" src="../assets/portrait.jpg" alt="Hridya Chopra" width="960" height="1280"><dl class="contact-details"><div><dt>Email</dt><dd><a href="mailto:choprahridya@gmail.com">choprahridya@gmail.com</a></dd></div><div><dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/hridyachopra" target="_blank" rel="noopener">hridyachopra ↗</a></dd></div><div><dt>Resume</dt><dd><a class="resume-download" href="../assets/resume.pdf" download="Hridya-Chopra-Resume.pdf">Download resume</a></dd></div></dl><section class="sidebar-section"><h2>Skills</h2><ul class="tag-list">${skills.map(skill=>`<li>${skill}</li>`).join('')}</ul></section><section class="sidebar-section"><h2>Tools</h2><ul class="tag-list">${tools.map(tool=>`<li>${tool}</li>`).join('')}</ul></section></aside><div class="about-content"><section class="bio"><div class="about-title"><h1>About me.</h1></div><div class="bio-copy"><p>I got into design because I like figuring out what people need and making everyday experiences easier to use.</p><p>At SCAD, I’m developing that approach through research, prototyping, and testing.</p><p>I’m curious about the decisions that make an experience feel intuitive: how information is organized, how a flow unfolds, and what changes after testing.</p></div></section><section class="about-chapter"><h2>Education</h2><ol class="timeline"><li><p class="period">2025–2029</p><h3>SCAD <span>(Savannah College of Art and Design)</span></h3><p>BFA UX Design · 3.77 GPA (Dean’s List)</p></li><li><p class="period">2019–2025</p><h3>HXLS <span>(Heritage Xperiential Learning School)</span></h3><p>PCM (CBSE) · Grade 12: 88%, Grade 10: 86%</p></li></ol></section><section class="about-chapter"><h2>Experience</h2><ol class="timeline"><li><p class="period">June–August 2026</p><h3>UX Design Intern</h3><p class="company">Ixigo</p><p>Designed wireframes and high-fidelity interfaces for airport cab booking, including Live Activity notifications, within Ixigo’s existing design system.</p></li><li><p class="period">April–June 2025</p><h3>Social Media Intern</h3><p class="company">Social Panga</p><p>Designed social media assets for clients using their brand guidelines.</p></li></ol></section></div></div><section class="about-connect"><h2>Want to connect?</h2><p>Get in touch to talk about design or internship opportunities.</p><a class="text-link" href="mailto:choprahridya@gmail.com">choprahridya@gmail.com <span>↗</span></a><a class="plain-link" href="${url('work')}">View my work ↗</a></section></main>${footer()}`;}
function render(scroll=true){disposeHero();document.body.dataset.mode=colorMode;const hash=location.hash.slice(1)||currentPage; const route=['home','work','about',...projects.map(p=>p.slug)].includes(hash)?hash:currentPage; currentPage=route==='work'?'home':route; history.replaceState(null,'',`?direction=${direction}&mode=${colorMode}&hero=${heroVariant}&work=${workLayout}&page=${currentPage}${location.hash}`); const project=projects.find(p=>p.slug===route);document.body.className=direction==='b'?'editorial':'';document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===direction)));document.getElementById('site').innerHTML=`<div id="top">${header()}${project?caseStudy(project):route==='about'?about():home()}</div>`;applyMode();document.getElementById('hero-variant').value=heroVariant;document.getElementById('work-layout').value=workLayout;const sculpture=document.getElementById('hero-sculpture');if(sculpture)disposeHero=window.createHeroArt(sculpture,heroVariant);document.title=`${project?project.title:route==='about'?'About':'Hridya Chopra'} — UX Designer`;if(scroll)document.getElementById('site').scrollTo({top:0,behavior:'instant'});if(['work','selected','system'].includes(route)){document.getElementById(route==='work'?'selected':route)?.scrollIntoView({behavior:'instant'});}}
document.addEventListener('click',event=>{const modeButton=event.target.closest('[data-mode]');if(modeButton){colorMode=modeButton.dataset.mode;try{localStorage.setItem('hridya-preview-mode',colorMode);}catch{}applyMode();}});
window.addEventListener('hashchange',()=>{const route=location.hash.slice(1);if(['main','context','contribution','experience','structure','reflection','top','system','selected'].includes(route)){document.getElementById(route)?.scrollIntoView();return;}render();});
render();

document.getElementById('hero-variant').addEventListener('change',event=>{
  heroVariant=event.target.value;
  try{localStorage.setItem('hridya-preview-hero-v2',heroVariant);}catch{}
  currentPage='home';
  history.replaceState(null,'',`?direction=a&mode=${colorMode}&hero=${heroVariant}&work=${workLayout}&page=home#home`);
  render();
});

document.getElementById('work-layout').addEventListener('change',event=>{
  workLayout=event.target.value;
  try{localStorage.setItem('hridya-preview-work-v2',workLayout);}catch{}
  currentPage='home';
  history.replaceState(null,'',`?direction=a&mode=${colorMode}&hero=${heroVariant}&work=${workLayout}&page=home#selected`);
  render(false);
  document.getElementById('selected').scrollIntoView({behavior:'instant'});
});



// A brief brand entrance, independent of asset/network loading.
function playIntro(){
 const root=document.documentElement;
 const overlay=document.getElementById('intro');
 if(!overlay)return;
 if(root.dataset.intro!=='pending'){overlay.remove();return;}
 const site=document.getElementById('site');
 site.inert=true;
 let dispose=()=>{};
 let finished=false;
 let timer;
 const finish=()=>{
  if(finished)return;
  finished=true;
  clearTimeout(timer);
  site.inert=false;
  root.dataset.intro='leaving';
  try{sessionStorage.setItem('hridya-intro-version-1','seen');}catch{}
  setTimeout(()=>{
   dispose();overlay.remove();delete root.dataset.intro;
   clearTimeout(window.introFallback);
   document.removeEventListener('keydown',onKey);
  },400);
 };
 const onKey=event=>{if(event.key==='Escape')finish();};
 overlay.querySelector('button').addEventListener('click',finish);
 document.addEventListener('keydown',onKey);
 try{dispose=window.createHeroArt(document.getElementById('intro-heart'),'heart');}catch{finish();return;}
 root.dataset.intro='playing';
 timer=setTimeout(finish,1400);
}
playIntro();
