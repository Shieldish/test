<html >

<head>

    <title>Account verification</title>

    <link href="css/style.css" type="text/css" rel="stylesheet" />

</head>

<body>

    <!-- start header div --> 

    <div id="header">

        <h3>confirmation mail</h3>

    </div>

    <!-- end header div -->   

      

    <!-- start wrap div -->   

    <div id="wrap">

        <!-- start PHP code -->



<?php

     

   include_once("config.php");             //inclure le code config.php qui contient la connexion a la base

     $postdata = file_get_contents("php://input");

     $request = json_decode($postdata);



    if(isset($_GET['token'])  && !empty($_GET['token']) )  //si le token est vide

    {

       

        $token=mysqli_escape_string($mysqli,$_GET['token']);    

        $updatequery="update Users set status='active' WHERE token='$token' ";   //metre a jours user q

        $search=mysqli_query($mysqli,"SELECT  status,token FROM Users where token='$token' AND status='inactif'") or die(mysql_error());

        $match =mysqli_num_rows($search);

        if($match>0)  //si la requete $search  est valable alors 

            $sql= mysqli_query($mysqli,$updatequery);  

            if($sql){

                

               //  header ('Location:https://pfe2022test.000webhostapp.com/login');

                         //si le compte est activé avec succes

                $msg= '<div  color="green" class="data"><p style="color:blue">notre compte a été activé, vous pouvez maintenant vous connecter  <a href="http://localhost:8080/login">ici</a></p>
                

                <html>
                <head>
                   <title>Reset password</title>
                   <meta http-equiv = "refresh" content = "3; url = http://localhost:8080/login" />
                </head>
              </html> 
                  </p> 
                     </p></div>';
                
   

                 

                

                 

               

            }

             //si non invalide

         else {

            $msg='<div class="data" style="color:red">Approche invalide, veuillez utiliser le lien qui vous a été envoyé par email.</div>';

            }

        }

        //ou si non votre compte a été déja activé

         else{

            $msg='<div class="data"><p style="color:red">L url est invalide ou vous avez déjà activé votre compte.</p></div>';

           

     }

        // if ($mysqli->query($sql) === TRUE) {

        //      $authdata = [

           

        //          'token' =>$token,

        //         'email' => $email,

        //          'Id'    => ''

        //        ];

        //        echo json_encode($authdata);

        //      }

    

?>







   <!-- stop PHP Code -->

  

   <?php echo $msg; ?>

   </div>

   

    <!-- end wrap div --> 

</body>

</html>

