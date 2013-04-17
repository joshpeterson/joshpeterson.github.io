require 'rake'

desc "Compile CSS files"
task :css do
  puts "Merging CSS"

  `del static\\css\\style.css`
  `del static\\css\\temp.css`

  %W{font-awesome syntax skeleton base layout}.each do |file|
    `type static\\css\\#{file}.css >> static\\css\\temp.css`
  end

  # `mv .\\static\\css\\temp.css .\\static\\css\\style.css`
  `java -jar ..\\development\\yuicompressor\\yuicompressor-2.4.7.jar static\\css\\temp.css > static\\css\\style.css`

  puts 'CSS dumped to static\\css\\style.css'
end

desc "Deploy site"
task :deploy do
  Rake::Task['css'].execute
  puts 'Comitting generated CSS'
  `git add static\\css\\`style.css`
  `git commit -m 'Compressed CSS for deploy'`

  puts "Pushing to Github"
  `git push origin master`
end

task "Serve"
task :serve do
  Rake::Task['css'].execute

  `set LANG=en_EN.UTF-8 && jekyll --serve --auto`
end
