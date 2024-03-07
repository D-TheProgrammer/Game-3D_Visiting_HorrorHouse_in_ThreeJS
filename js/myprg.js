//PROJET THREE JS
//Il est fait UNIQUEMNT en THREEJS sans autre librairie pour eviter tout probleme dimport

//--------------------------------------------------
//---------------PARTIE  GENERALE-------------------
//--------------------------------------------------
let cnv = document.querySelector('#myCanvas');
let renderer = new THREE.WebGLRenderer({ canvas: cnv, antialiasing: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.title = "Projet Room ONLY THREE JS!";

alert("Projet ThreeJs \n(/!\il se peut que rarement le programme bug si votre ordinateur bug veuillez le redemarrer dans ce cas/!\) \nCe projet est un jeu il s'agit d'une visite virutelle d'une salle , le joueur representer par la carte peut se deplacer a laide des touche :\nZ : Avant\nD : Rotation Camera Droite\n S : Arriere \nQ : Rotation Camera Gauche\n Enfin il est possible d'interagir avec des objet en appuyant sur le bouton 'O' quand un objet est selectionné (se transforme en vert) cela effectuera une modification sur l'objet.\nPour terminer 'L' allume et eteint la lampe torche ");


// On crée la scène et la caméra
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);
scene.add(camera);

// rotation de la caméra de 90 degrés 
camera.rotation.z = Math.PI / 2;

// Ajout de l'éclairage d'ambiance
let lumiere_ciel = new THREE.SpotLight(0xff0000, 1 , 1, Math.PI / 2 , 0);
lumiere_ciel.position.set(-11, 0, 24);
lumiere_ciel.castShadow = true;
lumiere_ciel.distance = 40; 

let target_lum_ciel = new THREE.Object3D();
target_lum_ciel.position.set(0, 0, 0); //cela va suivre ce point
lumiere_ciel.target = target_lum_ciel;

lumiere_ciel.distance = 28;
lumiere_ciel.angle = THREE.MathUtils.degToRad(25);
lumiere_ciel.decay = 0.1; 
lumiere_ciel.rotation.set(0,THREE.MathUtils.degToRad(25),0);

// Créer un cône de lumière pour visualiser la direction
// let aideLumiere = new THREE.SpotLightHelper(lumiere_ciel);
// scene.add(aideLumiere);

scene.add(lumiere_ciel);

// Activation des ombres pour la scène ou camera
scene.castShadow = true;
camera.castShadow = true;


let lampe_torche = new THREE.PointLight(0xffffff, 0.6 , 10);
lampe_torche.castShadow = true;
camera.add(lampe_torche);

lampe_torche.position.set(0, 0, 0);

// Variable pour suivre l'état de la lumière
let lampe_torche_active = true;

// Fonction pour activer/désactiver la lumière grace au bouton L
function ActiverLumiere() {
    lampe_torche_active = !lampe_torche_active;
    lampe_torche.visible = lampe_torche_active;
}


// Pour afficher les axes
// let axes = new THREE.AxesHelper(4);
// scene.add(axes);

// Pour afficher une grille
// let grille = new THREE.GridHelper();
// scene.add(grille);


//Gestion des collisons avec la camera/le joueur Pour cela on utilise un cube invisible attaché a la camera  
let cube_collisionCam_Geo = new THREE.BoxGeometry(1.6, 0.2, 0.2  ); 
let cube_collisionCam_Mat = new THREE.MeshBasicMaterial({ color: 0x0000ff , visible:false}); //on rend ce cube invisible
let cube_collisionCam = new THREE.Mesh(cube_collisionCam_Geo, cube_collisionCam_Mat);
cube_collisionCam.position.set(0.4,-0.6,-0.05);

//On cree la collision de ce cube invisible
let cube_collisionCam_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube_collisionCam_zone.setFromObject(cube_collisionCam);

scene.add(cube_collisionCam);


//Ce cube va servir afin  dinteragir avec les objet a distance 
let cube_collisionCam_Geo2 = new THREE.BoxGeometry(0.05, 0.01, 5.5); 
let cube_collisionCam_Mat2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 , visible:false}); //on rend cette cube invisible
let cube_collisionCam2 = new THREE.Mesh(cube_collisionCam_Geo2, cube_collisionCam_Mat2);
cube_collisionCam2.position.set(0, 0, -3);

//On cree la collision de ce cube invisible
let cube_collisionCam_zone2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube_collisionCam_zone2.setFromObject(cube_collisionCam2);

camera.add(cube_collisionCam2);


//Creation d'une croix pour un viseur 
let geometrieViseur1 = new THREE.BoxGeometry( 0.002,  0.004, -0.8);
let geometrieViseur2 = new THREE.BoxGeometry( 0.004,   0.002, -0.8);
let mat_Viseur = new THREE.MeshBasicMaterial({ color: 0x000000 });
let Viseur_Vertical = new THREE.Mesh(geometrieViseur1, mat_Viseur);
let Viseur_Horizontal = new THREE.Mesh(geometrieViseur2, mat_Viseur);
camera.add(Viseur_Vertical);
camera.add(Viseur_Horizontal);


//On cree des murs invisible empechant le joueur de sortir de la zone de jeu 
// Ils ont tous le meme materiaux et sont invisible juste leur position et orientation changent 

function creerMurInvisible(scene, ensembleMurs, largeur, hauteur, profondeur, posX, posY, posZ ) {
    let murInvisibleGeometry = new THREE.BoxGeometry(largeur, hauteur, profondeur);
    let murInvisibleMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 , visible : false  });
    let murInvisible = new THREE.Mesh(murInvisibleGeometry, murInvisibleMaterial);
    murInvisible.position.set(posX, posY, posZ);

    scene.add(murInvisible);

    //On les ajoute a la liste qui réinitialisera la position  ou celle dinteraction
    ensembleMurs.push(murInvisible);
}

let ensemble_mur_invisible_apparition = [];

creerMurInvisible(scene, ensemble_mur_invisible_apparition, 4.5, 9, 0.1, 0, 0, 5.5);  //mur invisible arriere
creerMurInvisible(scene, ensemble_mur_invisible_apparition, 4.5, 0.1, 6.1, 0, -3.5, 3.5); //mur invisible gauche 
creerMurInvisible(scene, ensemble_mur_invisible_apparition, 4.5, 0.1, 6.1, 0, 3.5, 3.5); //mur invisible gauche 


//--------------------------------------------------------
//---------------Construction de la maison ---------------
//--------------------------------------------------------

//Liste qui prend certains murs et qui en fonction des liste repoussent le joueurs dans une certaine direction
let ensemble_mur_gauche = [];
let ensemble_mur_droite = [];
let ensemble_mur_face = [];
let ensemble_mur_ariere = [];

//Cette fonction crée des murs qui ont un trou rectangulaire pour une porte
function creerMurAvecTrou(scene, posX, posY, posZ, rotationX, texture) {
    let mur = new THREE.Shape([ new THREE.Vector2(-2.5, 5.0), new THREE.Vector2(2.5, 5.0), new THREE.Vector2(2.5, -5.0), new THREE.Vector2(-2.5, -5.0)]);

    //Creation de la forme du trou pour la porte
    let trou_porte = new THREE.Path();
    trou_porte.moveTo(-1, -1);
    trou_porte.lineTo(2.5, -1);
    trou_porte.lineTo(2.5, 1);
    trou_porte.lineTo(-1, 1);
    trou_porte.lineTo(-1, -1);
    mur.holes = [trou_porte];

    let profondeur = { depth: 0.05, bevelEnabled: false };
    let geometry = new THREE.ExtrudeBufferGeometry(mur, profondeur);

    let mur_Mat = new THREE.MeshPhongMaterial({ map: texture });

    let mur_avec_trou_avant = new THREE.Mesh(geometry, mur_Mat);
    mur_avec_trou_avant.castShadow = true;
    mur_avec_trou_avant.position.set(posX, posY, posZ); //placement en XYZ 
    mur_avec_trou_avant.rotation.x = THREE.MathUtils.degToRad(rotationX); //pour la rotation car un nombre decimal effectue pas la rotation normalement 

    scene.add(mur_avec_trou_avant);
}

//On cree 2 Murs un derriere lautre car il est pas possible de mettre facilement sur une shape 2 texture
let texture_murAvant = new THREE.TextureLoader().load("assets/brique_maison.jpg"); 
texture_murAvant.wrapS = THREE.RepeatWrapping;
texture_murAvant.wrapT = THREE.RepeatWrapping;
texture_murAvant.repeat.set(0.3, 0.3);

let texture_murArriere = new THREE.TextureLoader().load("assets/texture_mur_trou.jpg");
texture_murArriere.wrapS = THREE.RepeatWrapping;
texture_murArriere.wrapT = THREE.RepeatWrapping;
texture_murArriere.repeat.set(0.1, 0.1);

creerMurAvecTrou(scene, 0, 0, 0.01, 0, texture_murAvant);
creerMurAvecTrou(scene, 0, 0, -0.01, 0, texture_murArriere);

//On cree les zone de collision en separe cest plus simple
creerMurInvisible(scene, ensemble_mur_face, 4.5, 2.8, 0.1, 0, 2.4, 0.3);  //mur invisible devant-droite 
creerMurInvisible(scene, ensemble_mur_face, 4.5, 2.8, 0.1, 0, -2.4, 0.3);  //mur invisible devant-gauche
creerMurInvisible(scene, ensemble_mur_ariere, 4.5, 3.2, 0.1, 0, 2.6, -0.3);  //mur invi3sible arriere-droite 
creerMurInvisible(scene, ensemble_mur_ariere, 4.5, 3.2, 0.1, 0, -2.6, -0.3);  //mur invisible arriere-gauche


//On crée la géométrie de la porte (un plan)
let porte_geo = new THREE.BoxGeometry(2, 3.55, 0.1); 
let textureLoader_porte = new THREE.TextureLoader();
let texture_porte = textureLoader_porte.load('./assets/texture_door.jpg');

let porte_mat = new THREE.MeshPhongMaterial({ map: texture_porte, side: THREE.DoubleSide });
porte_mat.shadowSide = THREE.DoubleSide;
let porte = new THREE.Mesh(porte_geo, porte_mat);
porte.castShadow = true;

//collision
let porte_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
porte_zone.setFromObject(porte);


porte.position.set(0.8, 1, 0); // Position 
porte.rotation.set(0, 0, THREE.MathUtils.degToRad(90));// Rotation 
porte.geometry.translate(-1, 0, 0); //On ajuste la translation pour que la porte souvre sur les coté

scene.add(porte);

let porte_ouverte = false; // Variable pour suivre l'état de la porte



//-------- MUR INTERIEUR MAISON -------------
function creerMurInterieur(scene, ensembleMurs, largeur, hauteur, profondeur, posX, posY, posZ, texture) {
    let murInterieurGeometry = new THREE.BoxGeometry(largeur, hauteur, profondeur);
    let murInterieurMaterial = new THREE.MeshPhongMaterial({ map: texture });
    let murInterieur = new THREE.Mesh(murInterieurGeometry, murInterieurMaterial);
    murInterieur.castShadow = true;
    murInterieur.position.set(posX, posY, posZ);

    scene.add(murInterieur);

    //Ajouter le mur à la liste pour les collisions
    ensembleMurs.push(murInterieur);
}

let textureLoader_murMaison = new THREE.TextureLoader();
let texture_murMaison = textureLoader_murMaison.load('./assets/mur_blanc1.jpg');

creerMurInterieur(scene, ensemble_mur_face, 5, 17, 0.1, 0, 3.5, -15, texture_murMaison);
creerMurInterieur(scene, ensemble_mur_gauche, 5, 0.1, 15.1, 0, -4.5, -7.5, texture_murMaison);
creerMurInterieur(scene, ensemble_mur_droite, 5, 0.1, 15.1, 0, 4.5, -7.5, texture_murMaison);


//Creation dune Sphère Pour le CIEL 
function creerBackground(scene, rayon, texture_foret) {
    let backgroundGeometry = new THREE.SphereGeometry(rayon, 32, 32);

    //répétition de la texture pour la sphère
    texture_foret.wrapS = THREE.RepeatWrapping;
    texture_foret.wrapT = THREE.RepeatWrapping;
    texture_foret.repeat.set(2, 1);

    let backgroundMaterial = new THREE.MeshBasicMaterial({ map: texture_foret , side: THREE.BackSide });
    let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

    background.position.set(0,0,2);
    // Inversion de la sphere pour que la texture soit à l'intérieur
    background.scale.x = -1;

    scene.add(background);
}

//Rayon de la sphère 
let rayonBackground = 100;
let textureLoader_foret = new THREE.TextureLoader();
let texture_foret = textureLoader_foret.load('./assets/ciel_nuit.jpg');

//On cree le ciel
creerBackground(scene, rayonBackground , texture_foret); 


// Création de la géométrie du sol  ou plafond C'est un plan
function creerSurface(scene, posX, posY, posZ, longueur, largeur,rotationY, rotationZ,texture, repetitionX, repetitionY) {
    let solGeometry = new THREE.BoxGeometry(longueur, largeur,0.001); 
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repetitionX, repetitionY);
    let solMaterial = new THREE.MeshPhongMaterial({ map: texture });
    
    let sol = new THREE.Mesh(solGeometry, solMaterial);
    sol.castShadow = true;
    //Rotation du sol pour qu'il soit orienté vers le haut
    sol.rotation.y = rotationY;
    sol.rotation.z = rotationZ;

    sol.position.set(posX,posY,posZ);
    scene.add(sol);
}

//Pour l'herbe 
let pos_X_Herbe = 4.5;
let longueur_herbe = 200; let  largeur_herbe = 200;
let rotation_sol = -Math.PI / 2;
let rotationZ_sol= 0;
let repetition_herbe=20;
let textureLoader_herbe = new THREE.TextureLoader();
let textureHerbe = textureLoader_herbe.load('./assets/herbe_sol.jpg');
creerSurface (scene, pos_X_Herbe , 0 , 0 ,longueur_herbe,largeur_herbe, rotation_sol, rotationZ_sol , textureHerbe , repetition_herbe,repetition_herbe);


//--------------------------------------------------------
//--------------- DECORATION  de la maison ---------------
//--------------------------------------------------------
//SOL MAISON  
let pos_X_sol = 2.5;
let pos_Y_sol = 0;
let pos_Z_sol = -10;

let longueur_sol = 10; let  largeur_sol = 20;
rotationZ_sol= THREE.MathUtils.degToRad(90);
let repetition_sol=4;
let repetition_sol2=4;
let textureLoader_sol = new THREE.TextureLoader();
let texture_sol = textureLoader_sol.load('./assets/sol.jpg');
creerSurface (scene, pos_X_sol , pos_Y_sol , pos_Z_sol ,longueur_sol,largeur_sol, rotation_sol,rotationZ_sol ,texture_sol , repetition_sol, repetition_sol2);

pos_X_sol = 2.6; 
pos_Y_sol = 8;
pos_Z_sol = -18;
creerSurface (scene, pos_X_sol , pos_Y_sol , pos_Z_sol ,longueur_sol,largeur_sol, rotation_sol,rotationZ_sol ,texture_sol , repetition_sol, repetition_sol2);

//PLAFOND
rotationZ_sol= THREE.MathUtils.degToRad(-90);
pos_X_sol = -2.5;
pos_Y_sol = 0;
pos_Z_sol = -10;
repetition_sol=1;
repetition_sol2=1;
texture_sol = textureLoader_sol.load('./assets/plafond.jpg');
creerSurface (scene, pos_X_sol , pos_Y_sol , pos_Z_sol ,longueur_sol,largeur_sol, rotation_sol,rotationZ_sol ,texture_sol , repetition_sol, repetition_sol2);

//TOIT  
function creerPyramide(scene, posX, posY, posZ, tailleBase, hauteur) {
    let pyramideGeo = new THREE.ConeGeometry(tailleBase / 2, hauteur, 4);
    let pyramideMat = new THREE.MeshPhongMaterial({ color: 0x964B00 });
    let pyramide = new THREE.Mesh(pyramideGeo, pyramideMat);
    pyramide.castShadow = true;

    pyramide.rotation.set(THREE.MathUtils.degToRad(45),0,THREE.MathUtils.degToRad(90));
    pyramide.position.set(posX, posY + hauteur / 2, posZ);
    scene.add(pyramide);
}
let textureLoader_toit = new THREE.TextureLoader();
let texturetoit = textureLoader_toit.load('./assets/toit.jpg');

//Appel d'une fonction pour créer une pyramide
creerPyramide(scene, -4.5, -2, -4, 14, 4);


//DECORATION TABLE
function creerTable(scene, pos_X_table, pos_Y_table, pos_Z_table, rotation_table , texture_table , texture_table2) {
    //Creation dun groupe pour la table pour que la rotation soit effectuer sur lensemble des element
    let groupeTable = new THREE.Group();

    //Création des pieds de la table
    let tablePied_Geo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
    let tablePied_Mat = new THREE.MeshPhongMaterial({ map : texture_table2 });

    let positionsTablePieds = [ [2.0, -2.8, -3.1],  [2.0, -4.2, -3.1], [2.0, -2.8, -6.7], [2.0, -4.2, -6.7] ];

    //Pour chaque pied on le place en XYZ 
    for (let i = 0; i < positionsTablePieds.length; i++) {
        let tablePied = new THREE.Mesh(tablePied_Geo, tablePied_Mat);
        tablePied.castShadow = true;
        let positionPiedTab = positionsTablePieds[i];
        tablePied.position.set(positionPiedTab[0] , positionPiedTab[1] ,positionPiedTab[2]);
        groupeTable.add(tablePied);
    }

    //On cree le haut de la table
    let tableHaut_geo = new THREE.BoxGeometry(0.1, 2, 4.3);
    let tableHaut_mat = new THREE.MeshPhongMaterial({ map : texture_table });

    let tableHaut = new THREE.Mesh(tableHaut_geo, tableHaut_mat);
    tableHaut.castShadow = true;
    tableHaut.position.set(1.25, -3.5, -4.9); //On le place
    groupeTable.add(tableHaut);

    // On applique la rotation au groupe
    let rotationRad = THREE.MathUtils.degToRad(rotation_table);
    groupeTable.rotation.x = rotationRad;

    // Positionner le groupe dans la scène
    groupeTable.position.set(pos_X_table, pos_Y_table, pos_Z_table);

    
    scene.add(groupeTable);
    return groupeTable;
}

let textureLoader_table = new THREE.TextureLoader();
let texture_table = textureLoader_table.load('./assets/bois_table.jpg');
let textureLoader_table2 = new THREE.TextureLoader();
let texture_table2 = textureLoader_table2.load('./assets/bois_table2.jpg');
// Utilisation de la fonction pour créer la table avec rotation
let table = creerTable(scene, 0, -1, 0, 30 , texture_table , texture_table2); 

//collision
let table_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
table_zone.setFromObject(table);


//CHAISE
function creerChaise(scene, pos_X_chaise, pos_Y_chaise, pos_Z_chaise, rotation_chaise , penchement, texture_chaise , texture_chaise2) {
    let groupeChaise = new THREE.Group();

    // Créer la géométrie et le matériau du siège
    let dossierGeo = new THREE.BoxGeometry(1, 0.1, 1);
    let dossierMat = new THREE.MeshPhongMaterial({ map:texture_chaise });

    // Creation du dossier de la chaise
    let dossier = new THREE.Mesh(dossierGeo, dossierMat);
    dossier.castShadow = true;
    dossier.position.set(-0.1, -0.05, 0);

    dossier.name = "dossierChaise";
    groupeChaise.add(dossier); // Ajout du siège au groupe

    // L'assise
    let assiseGeo = new THREE.BoxGeometry(0.2, 1, 1);
    let assiseMat = new THREE.MeshPhongMaterial({ map:texture_chaise });
    let assise = new THREE.Mesh(assiseGeo, assiseMat);
    assise.castShadow = true;
    assise.position.set(0.4, -0.5, 0);

    groupeChaise.add(assise); // Ajout de l'assise au groupe

    // Création des pieds de la chaise
    let positionsPieds = [ [0.9, -0.05, -0.4], [0.9, -0.9, -0.4], [0.9, -0.05, 0.4], [0.9, -0.9, 0.4] ];

    for (let i = 0; i < positionsPieds.length; i++) {
        let PiedGeo = new THREE.BoxGeometry(1, 0.1, 0.1);
        let Pied_Mat = new THREE.MeshPhongMaterial({ map:texture_chaise2 });

        let pied = new THREE.Mesh(PiedGeo, Pied_Mat);
        pied.castShadow = true;
        let positionPiedTab = positionsPieds[i];
        pied.position.set(positionPiedTab[0] , positionPiedTab[1] , positionPiedTab[2]);
        groupeChaise.add(pied); // Ajoute pied au groupe
    
        //Creation dune sphère en dessous de chaque pied
        let sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        let sphereMaterial = new THREE.MeshPhongMaterial({ map:texture_chaise2 });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;

        sphere.position.set(positionPiedTab[0] + 0.5, positionPiedTab[1] , positionPiedTab[2]); 
        sphere.rotation.set(0,0,90);
        groupeChaise.add(sphere); //et on met dans le groupe
    }

    //On fait la rotation et l'inclinaison au groupe
    let rotationRad = THREE.MathUtils.degToRad(rotation_chaise);
    groupeChaise.rotation.x = rotationRad;

    let penchementRad = THREE.MathUtils.degToRad(penchement);
    groupeChaise.rotation.z = penchementRad;

    // On Positionne le groupe dans la scène
    groupeChaise.position.set(pos_X_chaise, pos_Y_chaise, pos_Z_chaise);
    scene.add(groupeChaise);

    return  groupeChaise;
}

// Variables pour la position de la chaise
let pos_X_chaise = 1.0; let pos_Y_chaise = -2.8; let pos_Z_chaise = -6.5;
let rotation_chaise = -150; let penchement_chaise = 0;

let textureLoader_chaise = new THREE.TextureLoader();
let texture_chaise = textureLoader_chaise.load('./assets/bois_objets.png');
let texture_chaise2 = textureLoader_chaise.load('./assets/bois_objets2.jpg');

let chaise1 = creerChaise(scene, pos_X_chaise, pos_Y_chaise, pos_Z_chaise, rotation_chaise , penchement_chaise, texture_chaise , texture_chaise2);
let chaise1_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
chaise1_zone.setFromObject(chaise1);

pos_X_chaise = 2.4; pos_Y_chaise = 3.5; pos_Z_chaise = -7.5;
rotation_chaise = -90; penchement_chaise = -90;

let chaise2 = creerChaise(scene, pos_X_chaise, pos_Y_chaise, pos_Z_chaise, rotation_chaise , penchement_chaise, texture_chaise , texture_chaise2);
let chaise2_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
chaise2_zone.setFromObject(chaise2);


pos_X_chaise = 1.0; pos_Y_chaise = 3.8; pos_Z_chaise = -0.8;
rotation_chaise = 240; penchement_chaise = 35;

let chaise3 = creerChaise(scene, pos_X_chaise, pos_Y_chaise, pos_Z_chaise, rotation_chaise, penchement_chaise, texture_chaise , texture_chaise2);
let chaise3_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
chaise3_zone.setFromObject(chaise3);



//POUR CREER UN CADRE
//Pour creer un tableau 
function creerCadreAvecImage(scene, pos_X_cadre, pos_Y_cadre, pos_Z_cadre, largeur, hauteur, rotationCadre, penchementCadre,textureImageCadre) {
    let groupeCadre = new THREE.Group();

    // Créer le cadre
    let cadreGeo = new THREE.BoxGeometry(largeur + 0.1, hauteur  + 0.1, 0.1);
    let cadreMat = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    let cadre = new THREE.Mesh(cadreGeo, cadreMat);
    cadre.castShadow = true;

    groupeCadre.add(cadre);

    //toile
    let toileGeo = new THREE.BoxGeometry(largeur, hauteur, 0.1);
    let toileMat = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let toile = new THREE.Mesh(toileGeo, toileMat);
    toile.castShadow = true;

    toile.position.z = 0.01; // Déplace légèrement vers l'avant pour éviter la superposition

    // Créer le plan pour afficher l'image au centre du cadre
    let imageToileGeo = new THREE.PlaneGeometry(largeur - 0.1, hauteur - 0.1);
    let imageToileMat = new THREE.MeshPhongMaterial({ map: textureImageCadre, side: THREE.DoubleSide });
    let imageToile = new THREE.Mesh(imageToileGeo, imageToileMat);
    imageToile.position.z = 0.07; // Déplace légèrement vers l'avant pour éviter la superposition
    groupeCadre.add(imageToile);
    
    imageToile.name = "peinture";

    //On epplique la rotation et inclinaisonau groupe
    let rotationRad = THREE.MathUtils.degToRad(rotationCadre);
    groupeCadre.rotation.x = rotationRad;

    let penchementRad = THREE.MathUtils.degToRad(penchementCadre);
    groupeCadre.rotation.z = penchementRad;

    // Positionnement du groupe dans la scène
    groupeCadre.position.set(pos_X_cadre, pos_Y_cadre, pos_Z_cadre);

    scene.add(groupeCadre);

    return groupeCadre;
}

let loader = new THREE.TextureLoader();
let textureCadre = './assets/wildcard.png'; 
let textureImageCadre = loader.load(textureCadre);

textureImageCadre.minFilter = THREE.LinearFilter;

let pos_X_cadre = 0; let pos_Y_cadre = 0.0; let pos_Z_cadre = -14.8;
let largeurCadre = 2; let hauteurCadre = 1.8;
let rotationCadre =  0; let penchementCadre = 70;

// Utilisation de la fonction pour créer un cadre avec une image
let cadreAvecImage = creerCadreAvecImage(scene, pos_X_cadre, pos_Y_cadre, pos_Z_cadre, largeurCadre ,hauteurCadre , rotationCadre, penchementCadre,textureImageCadre); 
let cadre_zone = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cadre_zone.setFromObject(cadreAvecImage);



// Gestion des collisions avec les murs invisible ils réinitialise la position du joueurs 
// et les autres ils repoussent en conséquence
function verifCollisionAvecMurs() {
    for (let i = 0; i < ensemble_mur_invisible_apparition.length; i++) {
        let mur_invisible = ensemble_mur_invisible_apparition[i];
        let mur_invisible_zone = new THREE.Box3().setFromObject(mur_invisible);

        if (cube_collisionCam_zone.intersectsBox(mur_invisible_zone)) {
            camera.position.set(0, 0, 4);
        }
    }

    for (let i = 0; i < ensemble_mur_gauche.length; i++) {
        let mur_gauche = ensemble_mur_gauche[i];
        let mur_gauche_zone = new THREE.Box3().setFromObject(mur_gauche);

        if (cube_collisionCam_zone.intersectsBox(mur_gauche_zone)) {
            camera.position.y += 0.2;
        }
    }
    for (let i = 0; i < ensemble_mur_droite.length; i++) {
        let mur_droite = ensemble_mur_droite[i];
        let mur_droite_zone = new THREE.Box3().setFromObject(mur_droite);

        if (cube_collisionCam_zone.intersectsBox(mur_droite_zone)) {
            camera.position.y -= 0.2;
        }
    }
    for (let i = 0; i < ensemble_mur_face.length; i++) {
        let mur_face = ensemble_mur_face[i];
        let mur_face_zone = new THREE.Box3().setFromObject(mur_face);

        if (cube_collisionCam_zone.intersectsBox(mur_face_zone)) {
            camera.position.z += 0.3;
        }
    }
    for (let i = 0; i < ensemble_mur_ariere.length; i++) {
        let mur_arriere = ensemble_mur_ariere[i];
        let mur_arriere_zone = new THREE.Box3().setFromObject(mur_arriere);

        if (cube_collisionCam_zone.intersectsBox(mur_arriere_zone)) {
            camera.position.z -= 0.3;
        }
    }
}

// Animation de la porte
function animationPorte() {
    requestAnimationFrame(animationPorte);
    if (porte_ouverte) {
        // Si la porte est en train de s'ouvir et n'a pas atteint +90 degrés on fait une animation de fermeture
        if (porte.rotation.x < Math.PI / 2) {
            porte.rotation.x += 0.05; 
        }
    } 
    else {
        // Sinon si la porte est en train de se fermer et n'a pas atteint 0 degré on fait une animation d'ouverture
        if (porte.rotation.x > 0) {
            porte.rotation.x -= 0.05; 
        }
    }
    renderer.render(scene, camera);
}
animationPorte();


//Liste des objets qui auront une collision et qui repousseront le joueur
let liste_Zone_obj_aColi= [];
liste_Zone_obj_aColi.push(table_zone);
liste_Zone_obj_aColi.push(chaise1_zone);
liste_Zone_obj_aColi.push(chaise2_zone);
liste_Zone_obj_aColi.push(chaise3_zone);

let collisionDetectee = false;

function detecterCollision(liste_Zone_obj_aColi, cube_collisionCam_zone) {

    for (let i = 0; i < liste_Zone_obj_aColi.length; i++) {
        if (cube_collisionCam_zone.intersectsBox(liste_Zone_obj_aColi[i])) {
            collisionDetectee = true; // Collision détectée avec au moins un objet
        }
    }
    return collisionDetectee; // Zero collision avec aucun des objets de la liste    
}


let textureL_newText_chaise = new THREE.TextureLoader();

function gererObjetSelection(chaise, chaise_zone, dossierChaise , texture_nouvelle) {
    //Le changement en vert des chaise préselectionné
    chaise.children.forEach((element) => {
        if (element.material) {
            element.material.color.set(0x00ff00);
        }
    });

    // Si on appuie sur le bouton d'action "O" on change la texture
    document.addEventListener('keydown', function (event) {
        if (event.key.toLowerCase() === 'o') {
            dossierChaise.material.map = texture_nouvelle;
            dossierChaise.material.needsUpdate = true;
        }
    });
}

function preselectionChaise(objet) {
    objet.children.forEach((element) => {
        if (element.material) {
            element.material.color.set(0x00ff00);
        }
    });
}

function DeselectionObjet(objet) {
    objet.children.forEach((element) => {
        if (element.material) {
            element.material.color.set(0xffffff);
        }
    }); 
}



//Fonction qui gere les colision de la SCene  on appelera les fonction au dessus pour chaque cas 
function verifCollision(){
    //si le perso interagi avec la porte de dentrer de la maison, le perso recul 
    if (cube_collisionCam_zone.intersectsBox(porte_zone)) {
        camera.position.z += 0.1;
    } 

    if (cube_collisionCam_zone2.intersectsBox(porte_zone)) {
        // Changer la couleur de la porte lorsqu'on s'approche
        porte.material.color.set(0x00ff00);

        // Vérifier si la touche 'o' est enfoncée pour ouvrir/fermer la porte
        document.addEventListener('keydown', function (event) {
            if (event.key.toLowerCase() === 'o') { // Vous pouvez changer la touche selon vos préférences
                porte_ouverte = !porte_ouverte; // Inversez l'état de la porte
            }
        });
    } 
    else {
        // Remettre la couleur d'origine de la porte lorsque l'on s'éloigne ou que le curseur nest pas dessus 
        porte.material.color.set(0xffffff);
    }

    //Donc on on appelle la préselection verte et la modification de l'objet  en fonction des objets
    if (cube_collisionCam_zone2.intersectsBox(chaise1_zone)) {
        let dossierChaise1 = chaise1.getObjectByName("dossierChaise");
        let texture_nouvelle = textureL_newText_chaise.load('./assets/bois_objet_sang.jpg');
        preselectionChaise(chaise1);
        gererObjetSelection(chaise1, chaise1_zone, dossierChaise1 , texture_nouvelle);
    } 
    else if (cube_collisionCam_zone2.intersectsBox(chaise2_zone)) {
        let dossierChaise2 = chaise2.getObjectByName("dossierChaise");
        let texture_nouvelle = textureL_newText_chaise.load('./assets/bois_objet_sang.jpg');
        preselectionChaise(chaise2);
        gererObjetSelection(chaise2, chaise2_zone, dossierChaise2,texture_nouvelle);
    } 
    else if (cube_collisionCam_zone2.intersectsBox(chaise3_zone)) {
        let dossierChaise3 = chaise3.getObjectByName("dossierChaise");
        let texture_nouvelle = textureL_newText_chaise.load('./assets/bois_objet_sang.jpg');
        preselectionChaise(chaise3);
        gererObjetSelection(chaise3, chaise3_zone, dossierChaise3, texture_nouvelle);
    } 
    else if (cube_collisionCam_zone2.intersectsBox(cadre_zone)) {
        let texture_nouvelle = textureL_newText_chaise.load('./assets/peinture_chaotique.jpg');
        let peinture = cadreAvecImage.getObjectByName("peinture");
        preselectionChaise(cadreAvecImage);
        gererObjetSelection(cadreAvecImage, cadre_zone, peinture , texture_nouvelle);
    } 

    else {
        // Réinitialiser les chaises si aucune collision
        DeselectionObjet(chaise1);
        DeselectionObjet(chaise2);
        DeselectionObjet(chaise3);
        DeselectionObjet(chaise1);
        DeselectionObjet(cadreAvecImage);
    }
}


//Gestions des deplacements avec les touches convertis en minuscule avec Lowercase
//Et de la rotation
document.addEventListener('keydown', function (event) {
    // let vitesse = 0.1;  //vitesse de marche
    let vitesse = 0.2;  //vitesse de marche
    let vitesse_rotation = 0.08;

    let deplacementCam = 0;
    let axe_de_deplacement = 0;
    let angle_de_rotation = 0;

    switch (event.key.toLowerCase()) {
        case 'z':
            //On reccupere les information concernant l'axe de camera afin de la mettre a jour
            if (!detecterCollision(liste_Zone_obj_aColi, cube_collisionCam_zone)) {
                deplacementCam = new THREE.Vector3(0, 0, -vitesse);
                axe_de_deplacement = new THREE.Vector3(1, 0, 0);
                angle_de_rotation = camera.rotation.x;
                deplacementCam.applyAxisAngle(axe_de_deplacement, angle_de_rotation);
                //mise a jour de la camera
                camera.position.add(deplacementCam);
                //console.log("1");
            }
            else if (detecterCollision(liste_Zone_obj_aColi, cube_collisionCam_zone)) {
                
                deplacementCam = new THREE.Vector3(0, 0, vitesse);
                axe_de_deplacement = new THREE.Vector3(1, 0, 0);
                angle_de_rotation = camera.rotation.x;
                deplacementCam.applyAxisAngle(axe_de_deplacement, angle_de_rotation);
                //mise a jour de la camera
                camera.position.add(deplacementCam);
                collisionDetectee = false;
                //console.log("2");
            }
            break;
        case 'd':
            camera.rotation.x += vitesse_rotation;
            break;
        case 's':
            //On reccupere les information concernant l'axe de camera afin de la mettre a jour
            deplacementCam = new THREE.Vector3(0, 0, vitesse);
            axe_de_deplacement = new THREE.Vector3(1, 0, 0);
            angle_de_rotation = camera.rotation.x;
            deplacementCam.applyAxisAngle(axe_de_deplacement, angle_de_rotation);
            //mise a jour de la camera
            camera.position.add(deplacementCam);
            break;   

        case 'q':
            camera.rotation.x -= vitesse_rotation;
            break;

        case 'p':
            camera.rotation.y += vitesse_rotation;
            //cube_collisionCam.geometry.rotateX(-vitesse_rotation);
            cube_collisionCam.position.x += vitesse_rotation; 
            break;

        case 'm':
            camera.rotation.y -= vitesse_rotation;
            cube_collisionCam.geometry.rotateX(vitesse_rotation);
            cube_collisionCam.position.x -= vitesse_rotation; 
            break;
        
        //activer ou non la lampe de poche
        case "l" :
            ActiverLumiere();
            break;
    }
});


// Boucle de rendu
let animate = function () {
    requestAnimationFrame(animate);

    //mise a joir de la zone de collision de la camera
    cube_collisionCam_zone.copy(cube_collisionCam.geometry.boundingBox).applyMatrix4(cube_collisionCam.matrixWorld);
    cube_collisionCam_zone2.copy(cube_collisionCam2.geometry.boundingBox).applyMatrix4(cube_collisionCam2.matrixWorld);
    
    //Mise a jour des elements qui bouge donc la porte 
    porte_zone.copy(porte.geometry.boundingBox).applyMatrix4(porte.matrixWorld);
    
    cube_collisionCam.position.z = camera.position.z - 0.1;
    cube_collisionCam.rotation.x = camera.rotation.x;
    // cube_collisionCam.position.z = camera.position.z - 1 ;
    cube_collisionCam.position.y = camera.position.y ;
    cube_collisionCam.position.x = camera.position.x + 0.7 ;

    verifCollision();

    verifCollisionAvecMurs();

    renderer.render(scene, camera);
};



// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
