



<?php



//require '/usr/share/php/libphp-phpmailer/src/PHPMailer.php';  //declaration du bibliotheque pour envoyer de mail sur linux (phpMailer)



//require '/usr/share/php/libphp-phpmailer/src/SMTP.php';   //declaration du bibliotheque pour envoyer de mail sur linux (phpMailer)





include_once("config.php");

$postdata = file_get_contents("php://input");

$request = json_decode($postdata);

if(isset($postdata) && !empty($postdata))

{  

  $token = bin2hex(random_bytes(100));  



 

 

  $email = mysqli_real_escape_string($mysqli, trim($request->email));

 

     

 $sql = "INSERT INTO passwordreset (email,token) VALUES ('{$email}','{$token}')";

 // notez que sur windows le service pour envoyer le mail en localhost est sendmail.exe et il est automatiquement //intégre a xampp sur os windows

 //si en localhost linux xampp (lampp)  n'est pas intégré par le service sendmail donc il faut passer par une //bibliotheque phpMailer

 //installation  avec la commande suivante : apt-get install libphp-phpmailer



              //declaration du service sendmail sur windows

               

  $to = $email;

  $subject = "Mot de passe oublié ";

  $txt = "Veuillez suivre les instructions de l'e-mail pour réinitialiser votre mot de passe.<br>
               <h3>  Email: $email  </h3> <br>
           Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: <br>

                    <h3><a href='" . (getenv('APP_URL') ?: 'http://localhost:8081') . "/resetpassword.php?token=$token'>Réinitialiser mon mot de passe</a></h3>";

  $headers = "From:no-reply <kossisamuel.gabiam@fss.u-sfax.tn>" . "\r\n" ;
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
  $headers .= "CC:sign in Confirmation <kossisamuel.gabiam@fss.u-sfax.tn>\r\n";

 

  mail($to,$subject,$txt,$headers);

   

//    fin du service sendmail windows



// //Declare the object of PHPMailer pour linux



// $Email = new PHPMailer\PHPMailer\PHPMailer();



// //Mettre en place la configuration nécessaire pour envoyer un e-mail





// $Email->IsSMTP();



// $Email->SMTPAuth = true;



// $Email->SMTPSecure = 'ssl';



//  $Email->Host = "smtp.gmail.com";



//  $Email->Port = 465;



// // Définissez l'adresse gmail qui sera utilisée pour l'envoi de l'e-mail



// $Email->Username = "php.test.sendmail.086888@gmail.com";



// //Définir le mot de passe valide pour l'adresse gmail



// $Email->Password = "!A1Y5wN8#VwMA227VR:94kjU:12=uS";



// //Définir l'adresse e-mail de l'expéditeur



// $Email->SetFrom("php.test.sendmail.086888@gmail.com", "no-reply");



// //Définir l'adresse e-mail du destinataire



// $Email->AddAddress("$email");



// // Définir le sujet



// $Email->Subject = "Password reset";



// //Définir le contenu de l'e-mail

 

// $Email->Body = "Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :



// Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:

//           http://localhost/Api/resetpassword.php?token=$token   ";

   



// $Email->isHTML(true);





// $Email->Send();

// //fin phpmailer sur linux



if ($mysqli->query($sql) === TRUE) {

 

 

    $authdata = [

      

	    'email' => $email,

      'token' =>$token,

      'Id'    => mysqli_insert_id($mysqli)

    ];

    echo json_encode($authdata);

 

}







   

            

}

?>

