const int X = A1; // x axis
const int Y = A3; // y axis
const int RESET = 2; //reset button

unsigned long targetTime = 0;
const unsigned long interval = 1000;

int buttonState = 0;
int x = 0;
int y = 0;

void setup() {
  pinMode(X, INPUT);
  pinMode(Y, INPUT);
  pinMode(RESET, INPUT);
  Serial.begin(115200);
}

void loop() {
  if (millis() >= targetTime) {

    targetTime = millis() + interval;

    buttonState = digitalRead(RESET);

    if (buttonState == HIGH) { //If button is pressed, reset
      Serial.println(String("rst"));
      x = 0;
      y = 0;
    } else {
      int tmpdata_X = analogRead(X);
      int tmpdata_Y = analogRead(Y);
      if (tmpdata_X != x or tmpdata_Y != y) {
        x = tmpdata_X;
        y = tmpdata_Y;
				String output = String(x) + String(",") + String(y);
    		Serial.println(output);
      }
    }

  }
}
