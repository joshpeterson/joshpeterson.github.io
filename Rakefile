require 'rake'
#require 'os'

desc "Compile CSS files"
task :css do
  puts "Merging CSS"

  `rm static/css/style.css`

  %W{font-awesome syntax skeleton base layout gridtable}.each do |file|
    `cat static/css/#{file}.css >> static/css/style.css`
  end

  puts 'CSS dumped to static/css/style.css'

end

desc "Deploy site"
task :deploy do
  Rake::Task['css'].execute
  puts 'Comitting generated CSS'
  `git add static/css/style.css`
  `git commit -m "Compressed CSS for deploy"`

  puts "Pushing to Github"
  `git push origin master`
end

task "Serve"
task :serve do
  Rake::Task['css'].execute

  `bundle exec jekyll serve --host 0.0.0.0 --port 3000 --drafts`
end
