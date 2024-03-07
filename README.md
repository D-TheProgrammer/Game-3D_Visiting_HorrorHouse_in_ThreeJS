# Game-3D_Visiting_HorrorHouse_in_ThreeJS
[French] Projet permettant de se déplacer en 3D dans une maison modélisée en Three JS sans aucune autre bibliothèque   
[English] Project allowing 3D movement within a house modeled in Three JS without any other library  


### __[FRANCAIS]__ 
Projet en ThreeJS

Ce projet est un jeu qui propose une visite virtuelle d'une salle, réalisée UNIQUEMENT EN THREE JS (importée depuis un fichier .js, donc sans installation externe), sans aucune autre bibliothèque (tout a été fait à la main). Le joueur, représenté peut se déplacer à l'aide des touches suivantes :

Z : Avancer  
D : Rotation de la caméra vers la Droite  
S : Reculer  
Q : Rotation de la caméra vers la Gauche  
P : Pencher la tête / Regarder vers le Haut  
M : Pencher la tête / Regarder vers le Bas   

De plus, il est possible d'interagir avec les objets en appuyant sur le bouton "O" lorsqu'un objet est sélectionné (il devient vert), ce qui effectuera une modification sur l'objet.

Enfin, appuyer sur "L" allume et éteint la lampe torche.

(Il y a des collisions sur chaque objet de la scène, bien évidemment.)

Attention : il est possible que le programme rencontre rarement des bugs si votre ordinateur a des problèmes. Dans ce cas, veuillez le redémarrer.

> [!NOTE]
> [lien pour lancer le jeu en **ligne** ] : 
> https://d-theprogrammer.github.io/Game-3D_Visiting_HorrorHouse_in_ThreeJS/

> [!TIP] 
> il faut lancer un serveur Web **local** dans le répertoire contenant le fichier index.html à l’aide de la commande suivante :
> ```bash
> python3 -m http.server 8000
> ```
> Ensuite, visualisez le résultat en ouvrant la page http://localhost:8000/ dans un navigateur Web.



### __[ENGLISH]__ 

Project in ThreeJS

This project is a game that offers a virtual tour of a room, created SOLELY IN THREEJS (imported from a .js file, therefore without external installation), without any other library (everything has been done manually). The player, represented, can move using the following keys:

Z: Forward
D: Camera rotation to the Right
S: Backward
Q: Camera rotation to the Left
P: Tilt head / Look Up
M: Tilt head / Look Down

Moreover, it is possible to interact with objects by pressing the "O" button when an object is selected (it turns green), which will perform a modification on the object.

Finally, pressing "L" turns the flashlight on and off.

(There are collisions on each object in the scene, obviously.)

Attention: It is possible that the program may encounter rare bugs if your computer has issues. In this case, please restart it.


> [!NOTE]
> [link to start the game **online** ] : 
> https://d-theprogrammer.github.io/Game-3D_Visiting_HorrorHouse_in_ThreeJS/

> [!TIP] 
> you must launch a **local** Web server in the directory containing the index.html file using the following command:
> ```bash
> python3 -m http.server 8000
> ```
> Then view the result by opening the page `http://localhost:8000/` in a web browser


## [Démo et Tutoriel / Demo and Tutorial]

### [1] Le jeu accueille le joueur avec une explication des commandes / The game welcomes the player with an explanation of the controls 
<div align="center">
   <img width="884" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/6fd260d0-194d-40b7-9bf9-e4b1a6420ec5">
</div>

### [2]  L'extérieur de la maison sans lumière / The exterior of the house without light
<div align="center">
	<img width="817" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/ced606d8-b0ba-421f-8df6-52c0ca75c506">
</div>

### [3] : Utilisation de la lumière : on voit que la porte est sélectionnée en vert, donc on peut interagir avec elle, sinon elle ne serait pas verte / Use of light: we can see that the door is selected in green, so we can interact with it, otherwise it wouldn't be green
<div align="center">
	<img width="703" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/b80c0310-6eec-4596-8c95-5fa8ed96ff42">
</div>

### [4]: Déplacement du personnage et ouverture/interaction avec la porte. / Character movement and opening/interaction with the door
<div align="center">
	<img width="831" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/f40616a9-3000-4e4a-91bd-353654d03dff">
</div>

### [4] : Interieur de la maison  / Choose the image to decrypt
<div align="center">
	<img width="850" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/a0919f38-9753-42b7-b07f-ca1700c7b58a">
</div>

### [5] Il y a des collisions et des interactions avec des objets  / There are collisions and interactions with objects
<div align="center">
  <img width="772" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/455e1eed-a3b4-479d-bde8-c7ebbd5b4958">
   <img width="331" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/d22bcda4-e514-430d-bb0c-6dd4adfb5698">
   <img width="625" alt="image" src="https://github.com/D-TheProgrammer/Game-Visiting_HorrorHouse_in_ThreeJS/assets/151149998/04f2a4c4-323a-47fd-8590-8411fe105f6d"> 
</div>
