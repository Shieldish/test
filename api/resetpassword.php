<!DOCTYPE html>
<html>
   <head>
      <title>Reset password</title>
      <!-- <meta http-equiv = "refresh" content = "3; url = ' . (getenv('APP_FRONT_URL') ?: 'http://localhost:8080') . '/loginresetpassword" /> -->
   </head>
   <body>
     
   <?php


include_once("config.php");

$postdata = file_get_contents("php://input");

$request = json_decode($postdata);

//mettre les donnnes et rediriger lutilsiateur vers le loginresetpassword



 if(isset($_GET['token'])  && !empty($_GET['token']) )

{

   $token=mysqli_escape_string($mysqli,$_GET['token']);

   // $email=mysqli_escape_string($mysqli,$_GET['email']);

  

    $updatedata="update passwordreset set status=1 WHERE token='$token' ";

    

    $search=mysqli_query($mysqli,"SELECT  token , status FROM passwordreset where token='$token' and status='0' ")or die(mysql_error());

    $match =mysqli_num_rows($search);

    if($match>0)

    {

        $sql= mysqli_query($mysqli,$updatedata);

        if($sql){

             mysqli_query($mysqli,"delete FROM passwordreset where token='$token' and status='1' ");

             

            // header ('' . (getenv('APP_FRONT_URL') ?: 'http://localhost:8080') . '/loginresetpassword');

            

            $msg='<div  color="green" class="data"><p style="color:blue">you will be redirect to reset password dashboard  or click  <a href="' . (getenv('APP_FRONT_URL') ?: 'http://localhost:8080') . '/loginresetpassword">here</a> to reste your account
              <p>   <html>
              <head>
                 <title>Reset password</title>
                 <meta http-equiv = "refresh" content = "3; url = ' . (getenv('APP_FRONT_URL') ?: 'http://localhost:8080') . '/loginresetpassword" />
              </head>
            </html> 
                </p> 
                   </p></div>';

      

        }else {

            $msg='<div class="data">Invalid approach, please use the link that has been send to your email.</div>';

            }



    }else{

        

            $msg='<div class="data"><p style="color:red">The url is either invalid or your have been already reset your account .</p></div>';

    }





}

?>

   </body>
</html>





<?php echo $msg; ?>

