function makeChart(term, project, prs, issues, forks, stars) {
    let titleText = 'Open Source Stats';
    if (term) {
        titleText += ' for ' + term.split(' - ')[0];
    }
    Highcharts.chart('container', {
        title: {
            text: titleText
        },
    
        subtitle: {
            text: 'Source: github.com'
        },
    
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        },

        xAxis: {
            labels: {
                formatter: function () {
                    const displayDate = moment(project.Creation_Date).add(this.value, 'month').format("MM/DD/YYYY");
                    return this.value + '<br/>' + displayDate;
                }
            }
        },
    
        plotOptions: {
            series: {
                pointStart: 1,

                marker: {
                    enabled: false
                }
            }
        },
    
        series: [{
            name: 'PRs',
            type: 'spline',
            data: prs
        }, {
            name: 'Issues',
            type: 'spline',
            data: issues
        }, {
            name: 'Forks',
            type: 'spline',
            data: forks
        }, {
            name: 'Stars',
            type: 'spline',
            data: stars
        }]
    });
}

fetch('/api/projects')
    .then(function (response) {
        return response.json();
    })
    .then(function (projects) {
        new autoComplete({
            selector: 'input',
            minChars: 2,
            source: function(term, suggest){
                term = term.toLowerCase();
                let choices = projects.map(function(project) { return project.Project_Owner + '/' + project.Project_Name + ' - ' + project.Id; })
                let matches = [];
                for (i=0; i<choices.length; i++) {
                    if (choices[i].toLowerCase().indexOf(term) >= 0) {
                        matches.push(choices[i]);
                    }
                }
                suggest(matches);
            },
            onSelect: function(e, term, item){
                const projectId = term.split(' - ')[1];
                const project = projects.find(function (project) {
                    return project.Id == projectId;
                });
                
                fetch('/api/project/' + projectId)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (stats) {
                        // order so we can pop off the current month
                        stats = stats.sort(function (a,b) {
                            if (a.Month < b.Month) {
                                return -1;
                            } else if (a.Month > b.Month) {
                                return 1;
                            }
                            return 0;
                        })
                        // pop off the last month, it is probably partial data
                        stats.pop();
                        const maxMonth = Math.max(...stats.map(function (stat) {
                            return stat.Month;
                        }));
                        
                        const prs = new Array(maxMonth).fill(0);
                        const forks = new Array(maxMonth).fill(0);
                        const issues = new Array(maxMonth).fill(0);
                        const stars = new Array(maxMonth).fill(0);
                
                        stats.forEach(function (stat) {
                            prs[stat.Month - 1] = stat.PRs || 0;
                            forks[stat.Month - 1] = stat.Forks || 0;
                            issues[stat.Month - 1] = stat.Issues || 0;
                            stars[stat.Month - 1] = stat.Stars || 0;
                        });
                
                        makeChart(term, project, prs, forks, issues, stars);
                    });
                }
        });
    });

makeChart('', {}, [], [], [], []);