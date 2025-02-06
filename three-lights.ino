

// define int outside of setup and loop 
unsigned int ledPin;  
unsigned int ledPin2;
unsigned int ledPin3;  


// set up pings 
void setup()
{ 
 
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);  
}

void loop()
{   
  
  digitalWrite(ledPin, HIGH);
  digitalWrite(ledPin2, LOW);
  digitalWrite(ledPin3, HIGH);
  delay(700); 

  digitalWrite(ledPin, LOW);
  digitalWrite(ledPin2, HIGH);
  digitalWrite(ledPin3, LOW);
  delay(200); 


}
