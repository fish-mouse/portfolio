import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData(){
    const data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
  }));
    return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: false,
        writable: true,
        enumerable: true,
        // What other options do we need to set?
        // Hint: look up configurable, writable, and enumerable
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  // Create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Add total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Add total commits
  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Average line length / commit');
  dl.append('dd').text(d3.mean(commits, d=> d.totalLines).toFixed(2));


  let avgFrac = d3.mean(commits, d=> d.hourFrac);
  let hours = Math.floor(avgFrac);
  let amPm = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12; // midnight edge case
  
  dl.append('dt').text('Typical Commit Hour');
  dl.append('dd').text(`${hours} ${amPm}`);

  dl.append('dt').text('Typical Commit Day');
  let mostFreqDay = d3.rollups(
    commits,
    v => v.length,
    d => d.date.getDay()
  ).sort((a,b) => d3.descending(a[1], b[1]))[0][0];
  const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
  const dayName = days[mostFreqDay];
  dl.append('dd').text(dayName);

}

let data = await loadData();
let commits = processCommits(data);
console.log('Commits:', commits);
renderCommitInfo(data, commits);