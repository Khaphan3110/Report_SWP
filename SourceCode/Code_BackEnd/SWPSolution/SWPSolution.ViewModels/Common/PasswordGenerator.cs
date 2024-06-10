using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Common
{
    public class PasswordGenerator
    {
        public static string GeneratePassword(int length = 12)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_-+=<>{}[]";
            var validCharsArray = validChars.ToCharArray();
            var password = new char[length];
            var random = new Random();

            // Ensure at least one uppercase letter, lowercase letter, digit, and special character
            password[0] = validCharsArray[random.Next(validCharsArray.Length / 4, validCharsArray.Length / 2)]; // Uppercase letter
            password[1] = char.ToLower(validCharsArray[random.Next(validCharsArray.Length / 2, validCharsArray.Length * 3 / 4)]); // Lowercase letter
            password[2] = validCharsArray[random.Next(validCharsArray.Length * 3 / 4, validCharsArray.Length)]; // Digit
            password[3] = validCharsArray[random.Next(validCharsArray.Length * 3 / 4, validCharsArray.Length)]; // Special character

            // Fill the rest of the password with random characters
            for (int i = 4; i < length; i++)
            {
                password[i] = validCharsArray[random.Next(validCharsArray.Length)];
            }

            // Shuffle the password characters
            for (int i = 0; i < length; i++)
            {
                int swapIndex = random.Next(i, length);
                char temp = password[i];
                password[i] = password[swapIndex];
                password[swapIndex] = temp;
            }

            return new string(password);
        }
    }
}
