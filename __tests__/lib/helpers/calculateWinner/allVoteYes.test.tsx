import { expect, test } from 'vitest';

import { calculateWinner } from '@/lib/calculateWinner';

test('all vote yes', async () => {
  const votes = {
    yes: [
      { name: 'John Johnson', id: '1' },
      { name: 'Mike Mickelson', id: '2' },
      { name: 'Jack Jackson', id: '3' },
      { name: 'Rob Robertson', id: '4' },
      { name: 'Connor Connerson', id: '5' },
      { name: 'Kyle Kyleson', id: '6' },
      { name: 'Chris Christianson', id: '7' },
      { name: 'Dan Danson', id: '8' },
      { name: 'Fred Fredrickson', id: '9' },
      { name: 'Gary Garson', id: '10' },
      { name: 'Harry Harrison', id: '11' },
      { name: 'Ian Ianson', id: '12' },
      { name: 'Jake Jacobson', id: '13' },
      { name: 'Larry Larson', id: '14' },
      { name: 'Mark Markusson', id: '15' },
      { name: 'Nate Nathanson', id: '16' },
      { name: 'Oscar Osborn', id: '17' },
      { name: 'Pete Peterson', id: '18' },
      { name: 'Quinn Quinnson', id: '19' },
      { name: 'Rick Rickson', id: '20' },
      { name: 'Sam Samuelson', id: '21' },
      { name: 'Tom Tomson', id: '22' },
      { name: 'Ulysses Ulysson', id: '23' },
      { name: 'Vince Vinceston', id: '24' },
      { name: 'Will Williamson', id: '25' },
      { name: 'Xander Xanderson', id: '26' },
      { name: 'Yuri Yurison', id: '27' },
      { name: 'Zach Zachson', id: '28' },
      { name: 'Adam Adamson', id: '29' },
      { name: 'Brian Brianson', id: '30' },
      { name: 'Carl Carlson', id: '31' },
      { name: 'David Davidson', id: '32' },
      { name: 'Ethan Ethanson', id: '33' },
      { name: 'Frank Frankson', id: '34' },
      { name: 'George Georgeson', id: '35' },
      { name: 'Hank Hankson', id: '36' },
      { name: 'Isaac Isaacson', id: '37' },
      { name: 'Justin Justinson', id: '38' },
      { name: 'Kevin Kevinson', id: '39' },
      { name: 'Liam Liamson', id: '40' },
      { name: 'Mason Masonson', id: '41' },
      { name: 'Noah Noahson', id: '42' },
      { name: 'Owen Owensson', id: '43' },
      { name: 'Paul Paulson', id: '44' },
      { name: 'Quentin Quentinson', id: '45' },
      { name: 'Roger Rogerson', id: '46' },
      { name: 'Steve Stevenson', id: '47' },
      { name: 'Tim Timson', id: '48' },
      { name: 'Umar Umarson', id: '49' },
      { name: 'Victor Victorson', id: '50' },
      { name: 'Walt Waltson', id: '51' },
      { name: 'Xavier Xavison', id: '52' },
      { name: 'Yosef Yoson', id: '53' },
      { name: 'Zane Zaneson', id: '54' },
      { name: 'Aaron Aaronson', id: '55' },
      { name: 'Brandon Brandson', id: '56' },
      { name: 'Clint Clintson', id: '57' },
      { name: 'Drew Drewson', id: '58' },
      { name: 'Ed Edison', id: '59' },
      { name: 'Finn Finnson', id: '60' },
      { name: 'Glen Glenson', id: '61' },
      { name: 'Hugh Hughson', id: '62' },
    ],
    no: [],
    abstain: [],
  };
  const winner = calculateWinner(votes);
  expect(winner).toBe('yes');
});
